import { IGame, IInterfaceTexts, ICreateCharacter, ICreateCharacterStep, ICharacter } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component, Inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'level-up',
    template: getTemplate('levelup', await import('./levelup.component.html'))
})
export class LevelUpComponent {
    constructor(
        @Inject (GameService) private _gameService: GameService, 
        @Inject (CharacterService) private _characterService: CharacterService, 
        @Inject (ObjectFactory) objectFactory: ObjectFactory
    ) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    sheet: ICreateCharacter;
    game: IGame;
    texts: IInterfaceTexts;

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

    levelUp = (): ICharacter => this._gameService.levelUp();
}