namespace StoryScript {
    export class ConversationController {
        constructor(private _conversationService: IConversationService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = this._game;
        }

        game: IGame;

        answer = (node: IConversationNode, reply: IConversationReply): void => this._conversationService.answer(node, reply);

        getLines = (nodeOrReply: IConversationNode | IConversationReply): string => this._conversationService.getLines(nodeOrReply);
    }

    ConversationController.$inject = ['conversationService', 'game', 'customTexts'];
}