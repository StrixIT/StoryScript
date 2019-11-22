
import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './intro.component.html';

@Component({
    selector: 'intro',
    template: template,
})
export class IntroComponent {
    constructor(private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    endIntro = (): void => this._gameService.restart(true);
}