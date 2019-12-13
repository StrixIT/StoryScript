import { IGame, IInterfaceTexts } from '../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './gameover.component.html';

@Component({
    selector: 'game-over',
    template: template,
})
export class GameOverComponent {
    constructor(private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}