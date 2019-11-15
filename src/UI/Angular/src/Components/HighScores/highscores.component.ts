
import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './highscores.component.html';

@Component({
    selector: 'highscores',
    template: template,
})
export class HighScoresComponent {
    constructor(_objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}