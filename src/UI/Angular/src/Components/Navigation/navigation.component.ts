import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import template from './navigation.component.html';
import { Component } from '@angular/core';
import { GameService } from '../../../../../Engine/Services/gameService';

@Component({
    selector: 'navigation',
    template: template,
})
export class NavigationComponent {
    constructor(private _gameService: GameService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    menu = (): Enumerations.PlayState => this.game.playState = Enumerations.PlayState.Menu;

    reset = (): void => this._gameService.reset();
}