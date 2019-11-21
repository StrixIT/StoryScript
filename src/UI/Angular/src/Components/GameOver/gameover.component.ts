import { IGame, IInterfaceTexts } from '../../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './gameover.component.html';

@Component({
    selector: 'gameover',
    template: template,
})
export class GameOverComponent {
    constructor(private _gameService: GameService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}