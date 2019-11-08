import { IGame, IInterfaceTexts, Conversations } from '../../../../../Engine/Interfaces/storyScript';
import { IConversationService } from '../../../../../Engine/Services/interfaces/services';

export class ConversationController {
    constructor(private _conversationService: IConversationService, private _game: IGame, _texts: IInterfaceTexts) {
        this.game = this._game;
    }

    game: IGame;

    answer = (node: Conversations.IConversationNode, reply: Conversations.IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: Conversations.IConversationNode | Conversations.IConversationReply): string => this._conversationService.getLines(nodeOrReply);
}

ConversationController.$inject = ['conversationService', 'game', 'customTexts'];