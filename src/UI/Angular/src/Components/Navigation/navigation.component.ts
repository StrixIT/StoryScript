import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { GameService } from '../../../../../Engine/Services/gameService';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './navigation.component.html';

@Component({
    selector: 'navigation',
    template: template,
})
export class NavigationComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    menu = (): void => {
        this.game.playState = Enumerations.PlayState.Menu;
        this._sharedMethodService.setPlayState(this.game, Enumerations.PlayState.Menu);
    }

    reset = (): void => this._gameService.reset();
}