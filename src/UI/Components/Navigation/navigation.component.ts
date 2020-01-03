import { IGame, IInterfaceTexts, PlayState } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'navigation',
    template: getTemplate('navigation', require('./navigation.component.html'))
})
export class NavigationComponent {
    constructor(private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    menu = (): void => {
        this.game.playState = PlayState.Menu;
    }

    reset = (): void => this._gameService.reset();
}