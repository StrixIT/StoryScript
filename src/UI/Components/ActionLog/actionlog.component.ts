import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'action-log',
    template: getTemplate('actionlog', await import('./actionlog.component.html'))
})
export class ActionLogComponent {
    constructor(@Inject (ObjectFactory) objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}