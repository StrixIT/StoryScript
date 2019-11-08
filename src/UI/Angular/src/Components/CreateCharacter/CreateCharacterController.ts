import { IGame, IInterfaceTexts, CreateCharacters } from '../../../../../Engine/Interfaces/storyScript';
import { ICharacterService, IGameService } from '../../../../../Engine/Services/interfaces/services';

export class CreateCharacterController implements ng.IComponentController {
    constructor(private _characterService: ICharacterService, private _gameService: IGameService, _game: IGame, _texts: IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: IGame;
    texts: IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);

    distributionDone = (step: CreateCharacters.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}

CreateCharacterController.$inject = ['characterService', 'gameService', 'game', 'customTexts'];