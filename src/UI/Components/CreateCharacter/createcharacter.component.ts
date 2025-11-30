import {ICreateCharacterStep, IGame, IInterfaceTexts, IRules} from 'storyScript/Interfaces/storyScript';
import {GameService} from 'storyScript/Services/GameService';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {SharedModule} from "ui/Modules/sharedModule.ts";

@Component({
    standalone: true,
    selector: 'create-character',
    imports: [SharedModule],
    template: getTemplate('createcharacter', await import('./createcharacter.component.html?raw'))
})
export class CreateCharacterComponent {
    private readonly _characterService: CharacterService;
    private readonly _gameService: GameService;
    private readonly _rules: IRules;

    constructor() {
        this._characterService = inject(CharacterService);
        this._gameService = inject(GameService);
        const objectFactory = inject(ServiceFactory);
        this._rules = objectFactory.GetRules();
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    titleText = (): string => {
        if (this._rules.setup.numberOfCharacters > 1) {
            switch (this.game.party?.characters.length || 0) {
                case 0:
                    return this.texts.firstCharacter;
                case 1:
                    return this.texts.secondCharacter;
                case 2:
                    return this.texts.thirdCharacter;
                default:
                    return this.texts.format(this.texts.nthCharacter, [(this.game.party.characters.length + 1).toString()])
            }
        }

        return this.texts.newGame;
    };

    startText = (): string => {
        if (this._rules.setup.numberOfCharacters > 1 && (!this.game.party || this.game.party?.characters.length < this._rules.setup.numberOfCharacters - 1)) {
            return this.texts.nextCharacter;
        }

        return this.texts.startAdventure;
    };

    distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);
}