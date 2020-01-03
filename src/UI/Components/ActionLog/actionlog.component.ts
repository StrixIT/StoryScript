import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'action-log',
    template: getTemplate('actionlog', require('./actionlog.component.html'))
})
export class ActionLogComponent {
    constructor(objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}