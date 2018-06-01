namespace StoryScript {
    export interface IConversationService {
        initConversation(): void;
        answer(node: IConversationNode, reply: IConversationReply): void;
        getLines(nodeOrReply: IConversationNode | IConversationReply): string;
    }
}

namespace StoryScript {
    export class ConversationService implements IConversationService {
        constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
        }

        initConversation(): void {
            var self = this;
            var person = self._game.currentLocation.activePerson;

            if (!person || !person.conversation) {
                return;
            }

            var activeNode = person.conversation.activeNode;

            if (!activeNode) {
                activeNode = person.conversation.selectActiveNode ? person.conversation.selectActiveNode(self._game, person) : null;
            }

            if (!activeNode) {
                activeNode = person.conversation.nodes.filter((node) => { return node.active; })[0];
            }

            if (!activeNode) {
                activeNode = person.conversation.nodes.filter((node) => { return node.start; })[0];
            }

            if (!activeNode) {
                activeNode = person.conversation.nodes[0];
            }

            if (!activeNode) {
                return;
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
                                var hasItem = self._game.character.items.get(value) != undefined;

                                if (!hasItem) {
                                    for (var i in self._game.character.equipment) {
                                        var slotItem = <IItem>self._game.character.equipment[i];
                                        hasItem = slotItem != undefined && slotItem != null && slotItem.id != undefined && slotItem.id.toLowerCase() === value;
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
                    }

                    reply.available = isAvailable;
                }
            }

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

            if (reply.trigger) {
                person.conversation.actions[reply.trigger](self._game, person);
            }

            if (reply.setStart) {
                person.conversation.nodes.forEach(n => n.start = false);
                var startNode = person.conversation.nodes.filter((node) => { return node.node == reply.setStart; })[0];
                startNode.start = true;
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

        getLines = (nodeOrReply: IConversationNode | IConversationReply): string => {
            var self = this;

            if (nodeOrReply && nodeOrReply.lines) {
                return self._rules.processDescription ? self._rules.processDescription(self._game, nodeOrReply, 'lines') : nodeOrReply.lines;
            }

            return null;
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
                self._game.character.quests.push(quest);
                person.quests.remove(quest);
                quest.progress = quest.progress || {};

                if (quest.start) {
                    quest.start(self._game, quest, person);
                }

                quest.completed = false;
            }
            else {
                quest = self._game.character.quests.get(reply[type]);

                if (quest.complete) {
                    quest.complete(self._game, quest, person);
                }

                quest.completed = true;
            }
        }
    }
}