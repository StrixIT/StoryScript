import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { IGameService } from '../../../../../Engine/Services/interfaces/services';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import template from './navigation.component.html';
import { Component } from '@angular/core';
import { GameService } from '../../../../../Engine/Services/gameService';
import { CustomTexts } from '../../../../../Games/_TestGame/interfaces/types';

@Component({
    selector: 'navigation',
    template: template,
})
export class NavigationComponent {
    constructor(private _gameService: GameService, _texts: CustomTexts, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _texts;
    }

    game: IGame;
    texts: IInterfaceTexts;

    menu = (): Enumerations.PlayState => this.game.playState = Enumerations.PlayState.Menu;

    reset = (): void => this._gameService.reset();
}