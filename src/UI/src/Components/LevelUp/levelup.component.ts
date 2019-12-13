import { IGame, IInterfaceTexts, CreateCharacters, ICharacter } from '../../../../Engine/Interfaces/storyScript';
import { GameService } from '../../../../Engine/Services/gameService';
import { CharacterService } from '../../../../Engine/Services/characterService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './levelup.component.html';

@Component({
    selector: 'level-up',
    template: template,
})
export class LevelUpComponent {
    constructor(private _gameService: GameService, private _characterService: CharacterService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    sheet: CreateCharacters.ICreateCharacter;
    game: IGame;
    texts: IInterfaceTexts;

    distributionDone = (step: CreateCharacters.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

    levelUp = (): ICharacter => this._gameService.levelUp();
}