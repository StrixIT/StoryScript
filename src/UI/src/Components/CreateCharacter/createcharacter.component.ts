import { IGame, IInterfaceTexts, ICreateCharacterStep } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import template from './createcharacter.component.html';

@Component({
    selector: 'create-character',
    template: template,
})
export class CreateCharacterComponent {
    constructor(private _characterService: CharacterService, private _gameService: GameService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}