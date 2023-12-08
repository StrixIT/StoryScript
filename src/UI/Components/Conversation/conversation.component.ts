import { IGame, IConversationNode, IConversationReply } from 'storyScript/Interfaces/storyScript';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'conversation',
    template: getTemplate('conversation', await import('./conversation.component.html'))
})
export class ConversationComponent {
    constructor(private _conversationService: ConversationService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
    }

    game: IGame;

    answer = (node: IConversationNode, reply: IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: IConversationNode | IConversationReply): string => this._conversationService.getLines(nodeOrReply);
}