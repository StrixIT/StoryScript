import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'victory',
    template: getTemplate('victory', await import('./victory.component.html'))
})
export class VictoryComponent {
    constructor(
        @Inject (GameService) private _gameService: GameService, 
        @Inject (ObjectFactory) objectFactory: ObjectFactory
    ) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}