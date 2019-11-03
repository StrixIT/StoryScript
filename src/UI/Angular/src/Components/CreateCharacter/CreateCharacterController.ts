export class CreateCharacterController implements ng.IComponentController {
    constructor(private _characterService: StoryScript.ICharacterService, private _gameService: StoryScript.IGameService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    startNewGame = () => this._gameService.startNewGame(this.game.createCharacterSheet);

    distributionDone = (step: StoryScript.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.game.createCharacterSheet, step);
}

CreateCharacterController.$inject = ['characterService', 'gameService', 'game', 'customTexts'];