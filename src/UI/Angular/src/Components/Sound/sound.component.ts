import { GameService } from '../../../../../Engine/Services/gameService';
import { Component } from '@angular/core';
import template from './sound.component.html';

@Component({
    selector: 'sound',
    template: template,
})
export class SoundComponent {
    constructor(private _gameService: GameService) {
    }

    getCurrentMusic = (): string => this._gameService.getCurrentMusic();
}