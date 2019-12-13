
import { IGame, IInterfaceTexts } from '../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './highscores.component.html';

@Component({
    selector: 'highscores',
    template: template,
})
export class HighScoresComponent {
    constructor(objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
}