
namespace StoryScript {
    export class IntroController {
        constructor(private _gameService: IGameService, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        endIntro = (): void => this._gameService.restart(true);
    }

    IntroController.$inject = ['gameService', 'game', 'customTexts'];
}