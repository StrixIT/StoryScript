import { IGame, IInterfaceTexts, CreateCharacters } from '../../../../../Engine/Interfaces/storyScript';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';
import { GameService } from '../../../../../Engine/Services/gameService';
import { CharacterService } from '../../../../../Engine/Services/characterService';
import { Component } from '@angular/core';
import template from './createcharacter.component.html';

@Component({
    selector: 'createcharacter',
    template: template,
})
export class CreateCharacterComponent {
    constructor(private _characterService: CharacterService, private _gameService: GameService, _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);

    distributionDone = (step: CreateCharacters.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}