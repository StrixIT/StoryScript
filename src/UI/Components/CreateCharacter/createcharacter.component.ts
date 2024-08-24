import { IGame, IInterfaceTexts, ICreateCharacterStep, IRules } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'create-character',
    template: getTemplate('createcharacter', await import('./createcharacter.component.html?raw'))
})
export class CreateCharacterComponent {
    private _characterService: CharacterService;
    private _gameService: GameService;
    private _rules: IRules;

    constructor() {
        this._characterService = inject(CharacterService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this._rules = objectFactory.GetRules();
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    titleText: string;
    startText: string;
    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => {
        this._gameService.startNewGame(this.game.createCharacterSheet);
    }

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);

    getTitleText = () => {
        if (this._rules.setup.numberOfCharacters > 1) {
            switch (this.game.party?.characters.length || 0) {
                case 0: return this.texts.firstCharacter;
                case 1: return this.texts.secondCharacter;
                case 2: return this.texts.thirdCharacter;
                default: return this.texts.format(this.texts.nthCharacter, [(this.game.party.characters.length + 1).toString()])
            }
        }

        return this.texts.newGame;
    }

    getStartText = () => { 
        if (this._rules.setup.numberOfCharacters > 1 && (!this.game.party || this.game.party?.characters.length < this._rules.setup.numberOfCharacters - 1)) {
            return this.texts.nextCharacter;
        }

        return this.texts.startAdventure;
    }
}