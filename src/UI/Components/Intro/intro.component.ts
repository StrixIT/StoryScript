import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/GameService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'intro',
    template: getTemplate('intro', await import('./intro.component.html?raw'))
})
export class IntroComponent {
    private _gameService: GameService;
  
    constructor() {
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    endIntro = (): void => this._gameService.restart(true);
}