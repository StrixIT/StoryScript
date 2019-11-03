
export class IntroController {
    constructor(private _gameService: StoryScript.IGameService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    endIntro = (): void => this._gameService.restart(true);
}

IntroController.$inject = ['gameService', 'game', 'customTexts'];