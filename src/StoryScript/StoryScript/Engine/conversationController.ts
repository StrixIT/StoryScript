module StoryScript {
    export interface IConversationControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        conversation: IConversation;
    }

    export class ConversationController {
        private $scope: IConversationControllerScope;
        private $sce: ng.ISCEService;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: IConversationControllerScope, $sce: ng.ISCEService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.$sce = $sce;
            self.game = game;
            self.texts = texts;
            self.$scope.game = self.game;
            self.$scope.texts = self.texts;
            self.$scope.conversation = self.game.currentLocation.activePerson.conversation;
            self.init();
        }

        init = () => {
            var self = this;
            var person = self.game.currentLocation.activePerson;
            var activeNode = person.conversation.activeNode;

            if (!activeNode) {
                activeNode = person.conversation.nodes.some((node) => { return node.active; })[0];

                if (!activeNode) {
                    person.conversation.nodes[0].active = true;
                    person.conversation.activeNode = person.conversation.nodes[0];
                    activeNode = person.conversation.activeNode;
                }
            }

            if (person.conversation.prepareReplies) {
                person.conversation.prepareReplies(self.game, person, person.conversation.activeNode);
            }

            self.setReplyStatus(person.conversation, activeNode);
        }

        answer = (node: IConversationNode, reply: IConversationReply) => {
            var self = this;
            var person = self.game.currentLocation.activePerson;

            person.conversation.conversationLog = person.conversation.conversationLog || [];

            person.conversation.conversationLog.push({
                lines: node.lines,
                reply: reply.lines
            });

            if (person.conversation.handleReply) {
                person.conversation.handleReply(self.game, self.game.currentLocation.activePerson, node, reply);
            }

            if (reply.linkToNode) {
                person.conversation.activeNode = person.conversation.nodes.filter((node) => { return node.node == reply.linkToNode; })[0];

                if (person.conversation.prepareReplies) {
                    person.conversation.prepareReplies(self.game, self.game.currentLocation.activePerson, person.conversation.activeNode);
                }

                self.setReplyStatus(person.conversation, person.conversation.activeNode);
            }
            else {
                person.conversation.nodes.forEach((node) => {
                    node.active = false;
                });
                person.conversation.activeNode = null;
            }
        }

        getLines = (lines: string) => {
            var self = this;

            if (lines) {
                return self.$sce.trustAsHtml(lines);
            }
        }

        private setReplyStatus(conversation: IConversation, node: IConversationNode) {
            node.replies.forEach(reply => {
                if (reply.available == undefined) {
                    reply.available = true;
                }
                if (reply.showWhenUnavailable == undefined) {
                    reply.showWhenUnavailable = conversation.showUnavailableReplies;
                }
            });
        }
    }

    ConversationController.$inject = ['$scope', '$sce', 'game', 'customTexts'];
}