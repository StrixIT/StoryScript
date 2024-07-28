import {IConversationNode, IConversationReply, IGame} from 'storyScript/Interfaces/storyScript';
import {ConversationService} from 'storyScript/Services/ConversationService';
import {ObjectFactory} from 'storyScript/ObjectFactory';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';

@Component({
    selector: 'conversation',
    template: getTemplate('conversation', await import('./conversation.component.html'))
})
export class ConversationComponent {
    private _conversationService: ConversationService;

    constructor() {
        this._conversationService = inject(ConversationService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
    }

    game: IGame;

    answer = (node: IConversationNode, reply: IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: IConversationNode | IConversationReply): string => this._conversationService.getLines(nodeOrReply);

    get activeNode() {
        return this.game.person.conversation.activeNode
    };

    get conversationLog() {
        return this.game.person.conversation.conversationLog
    };
}