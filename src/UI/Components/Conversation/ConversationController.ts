namespace StoryScript {
    export class ConversationController {
        constructor(private _scope: ng.IScope, private _conversationService: IConversationService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = this._game;
            this._scope.$on('init', () => this.init());
        }

        conversation: IConversation;
        game: IGame;

        answer = (node: IConversationNode, reply: IConversationReply): void => this._conversationService.answer(node, reply);

        getLines = (nodeOrReply: IConversationNode | IConversationReply): string => this._conversationService.getLines(nodeOrReply);

        private init = (): void => {
            this._conversationService.initConversation();
            var conversation = this._game.currentLocation 
                                    && this._game.currentLocation.activePerson
                                    && this._game.currentLocation.activePerson.conversation;

            this.conversation = conversation;
        }
    }

    ConversationController.$inject = ['$scope', 'conversationService', 'game', 'customTexts'];
}