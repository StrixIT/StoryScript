import { IGame, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/GameService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';
import {CommonModule} from "@angular/common";

@Component({
    standalone: true,
    selector: 'game-over',
    imports: [CommonModule],
    template: getTemplate('gameover', await import('./gameover.component.html?raw'))
})
export class GameOverComponent {
    private readonly _gameService: GameService;

    constructor() {
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}