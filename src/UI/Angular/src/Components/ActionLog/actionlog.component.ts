import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { Component } from '@angular/core';
import template from './actionlog.component.html';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';

@Component({
    selector: 'actionlog',
    template: template,
})
export class ActionLogComponent {
    constructor(_objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}