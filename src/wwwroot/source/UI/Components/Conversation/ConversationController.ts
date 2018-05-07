namespace StoryScript {
    export class ConversationController {
        constructor(private _scope: ng.IScope, private _conversationService: IConversationService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self._scope.$on('init', () => self.init());
        }

        conversation: IConversation;
        game: IGame;

        answer = (node: IConversationNode, reply: IConversationReply) => {
            var self = this;
            self._conversationService.answer(node, reply);
        }

        getLines = (nodeOrReply: IConversationNode | IConversationReply) => {
            var self = this;
            return self._conversationService.getLines(nodeOrReply);
        }

        private init(): void {
            var self = this;
            self._conversationService.initConversation();
            self.conversation = self._game.currentLocation.activePerson.conversation;
        }
    }

    ConversationController.$inject = ['$scope', 'conversationService', 'game', 'customTexts'];
}