import { IGame, IInterfaceTexts, ICreateCharacterStep } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'create-character',
    template: getTemplate('createcharacter', await import('./createcharacter.component.html'))
})
export class CreateCharacterComponent {
    private _characterService: CharacterService;
    private _gameService: GameService;

    constructor() {
        this._characterService = inject(CharacterService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ObjectFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame([this.game.createCharacterSheet]);

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}