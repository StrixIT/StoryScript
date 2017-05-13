module StoryScript {
    export interface IConversationControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        conversation: IConversation;
    }

    export class ConversationController {
        private $scope: IConversationControllerScope;
        private ruleService: IRuleService;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: IConversationControllerScope, ruleService: IRuleService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.ruleService = ruleService;
            self.game = game;
            self.texts = texts;
            self.$scope.game = self.game;
            self.$scope.texts = self.texts;
            self.$scope.conversation = self.game.currentLocation.activePerson.conversation;
            self.init();
        }

        answer = (node: IConversationNode, reply: IConversationReply) => {
            var self = this;
            var person = self.game.currentLocation.activePerson;

            person.conversation.conversationLog = person.conversation.conversationLog || [];

            person.conversation.conversationLog.push({
                lines: node.lines,
                reply: reply.lines
            });

            if (reply.trigger) {
                person.conversation.actions[reply.trigger](self.game, person);
            }

            if (reply.linkToNode) {
                person.conversation.activeNode = person.conversation.nodes.filter((node) => { return node.node == reply.linkToNode; })[0];
                self.setReplyStatus(person.conversation, person.conversation.activeNode);
            }
            else {
                person.conversation.nodes.forEach((node) => {
                    node.active = false;
                });

                person.conversation.activeNode = null;
            }

            var questProgress = reply.questStart || reply.questComplete;

            if (questProgress) {
                var status = reply.questStart ? 'questStart' : 'questComplete';
                self.questProgress(status, person, reply);
            }
        }

        getLines = (nodeOrReply: IConversationNode | IConversationReply) => {
            var self = this;

            if (nodeOrReply && nodeOrReply.lines) {
                return self.ruleService.processDescription ? self.ruleService.processDescription(nodeOrReply, 'lines') : nodeOrReply.lines;
            }
        }

        private init(): void {
            var self = this;
            var person = self.game.currentLocation.activePerson;

            var activeNode = person.conversation.selectActiveNode ? person.conversation.selectActiveNode(self.game, person) : null;

            if (!activeNode) {
                activeNode = person.conversation.nodes.filter((node) => { return node.active; })[0];
            }

            if (!activeNode) {
                activeNode = person.conversation.nodes.filter((node) => { return node.start; })[0];
            }

            if (!activeNode) {
                activeNode = person.conversation.nodes[0];
            }

            activeNode.active = true;
            person.conversation.activeNode = activeNode;

            for (var n in activeNode.replies.options) {
                var reply = activeNode.replies.options[n];

                if (reply.linkToNode) {
                    if (!person.conversation.nodes.some((node) => { return node.node === reply.linkToNode; })) {
                        console.log('No node ' + reply.linkToNode + ' found to link to for reply ' + reply.lines + '!');
                    }
                }

                if (reply.requires) {
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

                        switch (type) {
                            case 'item': {
                                // Check item available. Item list first, equipment second.
                                var hasItem = self.game.character.items.get(value) != undefined;

                                if (!hasItem) {
                                    for (var i in self.game.character.equipment) {
                                        var slotItem = <IItem>self.game.character.equipment[i];
                                        hasItem = slotItem != undefined && slotItem != null && slotItem.id != undefined && slotItem.id.toLowerCase() === value;
                                    }
                                }

                                isAvailable = hasItem;
                            } break;
                            case 'location': {
                                // Check location visited
                                var location = self.game.locations.get(value);

                                if (!location) {
                                    console.log('Invalid location ' + value + ' for reply requirement for node ' + activeNode.node + '!');
                                }

                                isAvailable = location.hasVisited === true;
                            } break;
                            case 'quest-start':
                            case 'quest-done':
                            case 'quest-complete': {
                                // Check quest start, quest done or quest complete.
                                var quest = self.game.character.quests.get(value);
                                isAvailable = quest != undefined &&
                                    (type === 'quest-start' ? true : type === 'quest-done' ?
                                        quest.checkDone(self.game, quest) : quest.completed);
                            } break;
                            default: {
                                // Check attributes
                                var attribute = self.game.character[type];

                                if (!attribute) {
                                    console.log('Invalid attribute ' + type + ' for reply requirement for node ' + activeNode.node + '!');
                                }

                                isAvailable = isNaN(self.game.character[type]) ? self.game.character[type] === value : parseInt(self.game.character[type]) >= parseInt(value);
                            } break;
                        }
                    }

                    reply.available = isAvailable;
                }
            }

            self.setReplyStatus(person.conversation, activeNode);
        }

        private setReplyStatus(conversation: IConversation, node: IConversationNode) {
            node.replies.options.forEach(reply => {
                if (reply.available == undefined) {
                    reply.available = true;
                }
                if (reply.showWhenUnavailable == undefined) {
                    reply.showWhenUnavailable = conversation.showUnavailableReplies;
                }
            });
        }

        private questProgress(type: string, person: ICompiledPerson, reply: IConversationReply) {
            var self = this;
            var quest: IQuest;
            var start = type === "questStart";

            if (start) {
                quest = person.quests.get(reply[type]);
                quest.issuedBy = person.id;
                self.game.character.quests.push(quest);
                person.quests.remove(quest);
                quest.progress = {};

                if (quest.start) {
                    quest.start(self.game, quest, person);
                }

                quest.completed = false;
            }
            else {
                quest = self.game.character.quests.get(reply[type]);

                if (quest.complete) {
                    quest.complete(self.game, quest, person);
                }

                quest.completed = true;
            }
        }
    }

    ConversationController.$inject = ['$scope', 'ruleService', 'game', 'customTexts'];
}