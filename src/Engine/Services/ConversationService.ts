namespace StoryScript {
    export interface IConversationService {
        loadConversations(): void;
        initConversation(): void;
        answer(node: IConversationNode, reply: IConversationReply): void;
        getLines(nodeOrReply: IConversationNode | IConversationReply): string;
    }
}

namespace StoryScript {
    export class ConversationService implements IConversationService {
        constructor(private _dataService: IDataService, private _game: IGame) {
        }

        loadConversations = (): void => {
            var self = this;
            var persons = self._game.currentLocation && self._game.currentLocation.persons;

            if (!persons) {
                return;
            }

            persons.filter(p => p.conversation && !p.conversation.nodes).forEach((person) => {
                var htmlDoc = self.loadConversationHtml(person);
                var defaultReply = self.getDefaultReply(htmlDoc, person);
                var conversationNodes = htmlDoc.getElementsByTagName('node');

                person.conversation.nodes = [];
                self.processConversationNodes(conversationNodes, person, defaultReply);
                self.checkNodes(person);

                var nodeToSelect = person.conversation.nodes.filter(n => person.conversation.activeNode && n.node === person.conversation.activeNode.node);
                person.conversation.activeNode = nodeToSelect.length === 1 ? nodeToSelect[0] : null;
            });
        }

        initConversation(): void {
            var self = this;
            var person = self._game.currentLocation && self._game.currentLocation.activePerson;
            var activeNode = self.getActiveNode(person);

            if (!activeNode) {
                return;
            }

            person.conversation.activeNode = activeNode;
            self.initReplies(person);
            self.setReplyStatus(person.conversation, activeNode);
        }

        answer = (node: IConversationNode, reply: IConversationReply): void => {
            var self = this;
            var person = self._game.currentLocation.activePerson;

            person.conversation.conversationLog = person.conversation.conversationLog || [];

            person.conversation.conversationLog.push({
                lines: node.lines,
                reply: reply.lines
            });

            self.processReply(person, reply);

            var questProgress = reply.questStart || reply.questComplete;

            if (questProgress) {
                var status = reply.questStart ? 'questStart' : 'questComplete';
                self.questProgress(status, person, reply);
            }
        }

        getLines = (nodeOrReply: IConversationNode | IConversationReply): string => {
            if (nodeOrReply && nodeOrReply.lines) {
                return nodeOrReply.lines;
            }

            return null;
        }

        private loadConversationHtml(person: IPerson): Document {
            var self = this;
            var conversations = self._dataService.loadDescription('persons', person);
            var parser = new DOMParser();

            if (conversations.indexOf('<conversation>') == -1) {
                conversations = '<conversation>' + conversations + '</conversation>';
            }

            return parser.parseFromString(conversations, 'text/html');
        }

        private getDefaultReply(htmlDoc: Document, person: IPerson): string {
            var defaultReplyNodes = htmlDoc.getElementsByTagName('default-reply');
            var defaultReply: string = null;

            if (defaultReplyNodes.length > 1) {
                throw new Error('More than one default reply in conversation for person ' + person.id + '.');
            }
            else if (defaultReplyNodes.length === 1) {
                defaultReply = defaultReplyNodes[0].innerHTML.trim();
            }

            return defaultReply;
        }

        private processConversationNodes(conversationNodes: HTMLCollectionOf<Element>, person: IPerson, defaultReply: string) {
            var self = this;

            for (var i = 0; i < conversationNodes.length; i++) {
                var node = conversationNodes[i];
                var newNode = self.getNewNode(person, node);

                self.processReplyNodes(person, node, newNode, defaultReply);

                if (!newNode.replies && defaultReply) {
                    newNode.replies = {
                        defaultReply: true,
                        options: [
                            {
                                lines: defaultReply
                            }
                        ]
                    };
                }

                newNode.lines = node.innerHTML.trim();
                person.conversation.nodes.push(newNode);
            }
        }

        private getNewNode(person: IPerson, node: Element): IConversationNode {
            var nameAttribute = node.attributes['name'] && <string>node.attributes['name'].nodeValue;

            if (!nameAttribute && console) {
                console.log('Missing name attribute on node for conversation for person ' + person.id + '. Using \'default\' as default name');
                nameAttribute = 'default';
            }

            if (person.conversation.nodes.some((node) => { return node.node == nameAttribute; })) {
                throw new Error('Duplicate nodes with name ' + name + ' for conversation for person ' + person.id + '.');
            }

            return <IConversationNode>{
                node: nameAttribute,
                lines: '',
                replies: null,
            };
        }

        private processReplyNodes(person: IPerson, node: Element, newNode: IConversationNode, defaultReply: string) {
            var self = this;

            for (var j = 0; j < node.childNodes.length; j++) {
                var replies = node.childNodes[j];

                if (compareString(replies.nodeName, 'replies')) {
                    var addDefaultValue = self.GetNodeValue(replies, 'default-reply');
                    var addDefaultReply = compareString(addDefaultValue, 'false') ? false : true;

                    newNode.replies = <IConversationReplies>{
                        defaultReply: <boolean>addDefaultReply,
                        options: []
                    };

                    self.buildReplies(person, newNode, replies);
                    node.removeChild(replies);

                    if (defaultReply && newNode.replies.defaultReply) {
                        newNode.replies.options.push(<IConversationReply>{
                            lines: defaultReply
                        });
                    }
                }
            }
        }

        private buildReplies(person: IPerson, newNode: IConversationNode, replies: ChildNode) {
            var self = this;

            for (var k = 0; k < replies.childNodes.length; k++) {
                var replyNode = replies.childNodes[k];

                if (compareString(replyNode.nodeName, 'reply')) {
                    var requires = self.GetNodeValue(replyNode, 'requires');
                    var linkToNode = self.GetNodeValue(replyNode, 'node');
                    var trigger = self.GetNodeValue(replyNode, 'trigger');
                    var questStart = self.GetNodeValue(replyNode, 'quest-start');
                    var questComplete = self.GetNodeValue(replyNode, 'quest-complete');
                    var setStart = self.GetNodeValue(replyNode, 'set-start');

                    if (trigger && !person.conversation.actions[trigger]) {
                        console.log('No action ' + trigger + ' for node ' + newNode.node + ' found.');
                    }

                    var reply = <IConversationReply>{
                        requires: requires,
                        linkToNode: linkToNode,
                        trigger: trigger,
                        questStart: questStart,
                        questComplete: questComplete,
                        setStart: setStart,
                        lines: (<any>replyNode).innerHTML.trim(),
                    };

                    newNode.replies.options.push(reply);
                }
            }
        }

        private checkNodes(person: IPerson) {
            person.conversation.nodes.forEach(n => {
                if (n.replies && n.replies.options)
                {
                    n.replies.options.forEach(r => {
                        if (r.linkToNode && !person.conversation.nodes.some(n => n.node === r.linkToNode)) {
                            console.log('No node ' + r.linkToNode + ' to link to found for node ' + n.node + '.');
                        }

                        if (r.setStart && !person.conversation.nodes.some(n => n.node === r.setStart)) {
                            console.log('No new start node ' + r.setStart + ' found for node ' + n.node + '.');
                        }
                    });
                }
            });
        }

        private GetNodeValue(node: Node, attribute: string): string {
            return (<any>node).attributes[attribute] && (<any>node).attributes[attribute].value
        }

        private getActiveNode(person: IPerson): IConversationNode {
            var self = this;

            if (!person || !person.conversation) {
                return null;
            }

            var conversation = person.conversation;
            var activeNode = conversation.activeNode;

            if (!activeNode) {
                activeNode = conversation.selectActiveNode ? conversation.selectActiveNode(self._game, person) : null;
            }

            if (!activeNode) {
                activeNode = conversation.nodes.filter((node) => { return compareString(node.node, person.conversation.startNode); })[0];
            }

            if (!activeNode) {
                activeNode = conversation.nodes[0];
            }

            return activeNode;
        }

        private initReplies(person: IPerson): void {
            var self = this;
            var activeNode = person.conversation.activeNode;

            if (activeNode.replies) {
                for (var n in activeNode.replies.options) {
                    var reply = activeNode.replies.options[n];

                    if (reply.linkToNode) {
                        if (!person.conversation.nodes.some((node) => { return node.node === reply.linkToNode; })) {
                            console.log('No node ' + reply.linkToNode + ' found to link to for reply ' + reply.lines + '!');
                        }
                    }

                    if (reply.requires) {
                        reply.available = self.checkReplyAvailability(activeNode, reply);
                    }
                }
            }
        }

        private processReply(person: IPerson, reply: IConversationReply) {
            var self = this;

            if (reply.trigger) {
                person.conversation.actions[reply.trigger](self._game, person);
            }

            if (reply.setStart) {
                var startNode = person.conversation.nodes.filter((node) => { return node.node == reply.setStart; })[0];
                person.conversation.startNode = startNode.node;
            }

            if (reply.linkToNode) {
                person.conversation.activeNode = person.conversation.nodes.filter((node) => { return node.node == reply.linkToNode; })[0];
                self.setReplyStatus(person.conversation, person.conversation.activeNode);
            }
            else {
                person.conversation.activeNode = null;
            }
        }

        private checkReplyAvailability(activeNode: IConversationNode, reply: IConversationReply) : boolean {
            var self = this;
            var isAvailable = true;
            var requirements = reply.requires.split(',');

            for (var m in requirements) {
                var requirement = requirements[m];
                var values = requirement.toLowerCase().trim().split('=');
                var type = values[0];
                var value = values[1];

                if (!type || !value) {
                    console.log('Invalid reply requirement for node ' + activeNode.node + '!');
                }

                isAvailable = self.checkReplyRequirements(activeNode, type, value);

                if (!isAvailable) {
                    break;
                }
            }

            return isAvailable;
        }

        private checkReplyRequirements(activeNode: IConversationNode, type: string, value: string): boolean {
            var self = this;
            var isAvailable = true;

            switch (type) {
                case 'item': {
                    // Check item available. Item list first, equipment second.
                    var hasItem = self._game.character.items.get(value) != undefined;

                    if (!hasItem) {
                        for (var i in self._game.character.equipment) {
                            var slotItem = <IItem>self._game.character.equipment[i];
                            hasItem = slotItem != undefined && slotItem != null && compareString(slotItem.id, value);
                        }
                    }

                    isAvailable = hasItem;
                } break;
                case 'location': {
                    // Check location visited
                    var location = self._game.locations.get(value);

                    if (!location) {
                        console.log('Invalid location ' + value + ' for reply requirement for node ' + activeNode.node + '!');
                    }

                    isAvailable = location.hasVisited === true;
                } break;
                case 'quest-start':
                case 'quest-done':
                case 'quest-complete': {
                    // Check quest start, quest done or quest complete.
                    var quest = self._game.character.quests.get(value);
                    isAvailable = quest != undefined &&
                        (type === 'quest-start' ? true : type === 'quest-done' ?
                            quest.checkDone(self._game, quest) : quest.completed);
                } break;
                default: {
                    // Check attributes
                    var attribute = self._game.character[type];

                    if (!attribute) {
                        console.log('Invalid attribute ' + type + ' for reply requirement for node ' + activeNode.node + '!');
                    }

                    isAvailable = isNaN(self._game.character[type]) ? self._game.character[type] === value : parseInt(self._game.character[type]) >= parseInt(value);
                } break;
            }

            return isAvailable;
        }

        private setReplyStatus(conversation: IConversation, node: IConversationNode) {
            if (node.replies && node.replies.options) {
                node.replies.options.forEach(reply => {
                    if (reply.available == undefined) {
                        reply.available = true;
                    }
                    if (reply.showWhenUnavailable == undefined) {
                        reply.showWhenUnavailable = conversation.showUnavailableReplies;
                    }
                });
            }
        }

        private questProgress(type: string, person: IPerson, reply: IConversationReply) {
            var self = this;
            var quest: IQuest;
            var start = type === 'questStart';

            if (start) {
                quest = person.quests.get(reply[type]);

                if (!quest.started) {
                    quest.issuedBy = person.id;
                    self._game.character.quests.push(quest);
                    person.quests.remove(quest);
                    quest.progress = quest.progress || {};

                    if (quest.start) {
                        quest.start(self._game, quest, person);
                    }

                    quest.started = true;
                    quest.completed = false;
                }
            }
            else {
                quest = self._game.character.quests.get(reply[type]);

                if (!quest.completed) {
                    if (quest.complete) {
                        quest.complete(self._game, quest, person);
                    }

                    quest.completed = true;
                }
            }
        }
    }
}