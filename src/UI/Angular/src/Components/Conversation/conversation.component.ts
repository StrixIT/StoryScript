import { IGame, Conversations } from '../../../../../Engine/Interfaces/storyScript';
import { ConversationService } from '../../../../../Engine/Services/ConversationService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './conversation.component.html';

@Component({
    selector: 'conversation',
    template: template,
})
export class ConversationComponent {
    constructor(private _conversationService: ConversationService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
    }

    game: IGame;

    answer = (node: Conversations.IConversationNode, reply: Conversations.IConversationReply): void => this._conversationService.answer(node, reply);

    getLines = (nodeOrReply: Conversations.IConversationNode | Conversations.IConversationReply): string => this._conversationService.getLines(nodeOrReply);
}