export class ConversationController {
    constructor(private _conversationService: StoryScript.IConversationService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = this._game;
    }

    game: StoryScript.IGame;

    answer = (node: StoryScript.IConversationNode, reply: StoryScript.IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: StoryScript.IConversationNode | StoryScript.IConversationReply): string => this._conversationService.getLines(nodeOrReply);
}

ConversationController.$inject = ['conversationService', 'game', 'customTexts'];