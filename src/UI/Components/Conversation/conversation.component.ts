import {IConversationNode, IConversationReply, IGame, IInterfaceTexts} from 'storyScript/Interfaces/storyScript';
import {ConversationService} from 'storyScript/Services/ConversationService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';

@Component({
    selector: 'conversation',
    template: getTemplate('conversation', await import('./conversation.component.html?raw'))
})
export class ConversationComponent {
    private _conversationService: ConversationService;

    constructor() {
        this._conversationService = inject(ConversationService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    answer = (node: IConversationNode, reply: IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: IConversationNode | IConversationReply): string => nodeOrReply?.lines || null;

    get activeNode() {
        return this.game.person.conversation.activeNode
    };

    get conversationLog() {
        return this.game.person.conversation.conversationLog
    };
}