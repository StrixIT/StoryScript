export class VictoryController implements ng.IComponentController {
    constructor(private _gameService: StoryScript.IGameService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    restart = (): void => this._gameService.restart();
}

VictoryController.$inject = ['gameService', 'game', 'customTexts'];