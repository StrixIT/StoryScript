import { IGame, IInterfaceTexts, ICreateCharacterStep } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'create-character',
    template: getTemplate('createcharacter', await import('./createcharacter.component.html'))
})
export class CreateCharacterComponent {
    constructor(
        @Inject (CharacterService) private _characterService: CharacterService, 
        @Inject (GameService) private _gameService: GameService,
        @Inject (ObjectFactory) objectFactory: ObjectFactory
    ) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}