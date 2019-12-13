import { IGame, IInterfaceTexts } from '../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './actionlog.component.html';

@Component({
    selector: 'action-log',
    template: template,
})
export class ActionLogComponent {
    constructor(objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}