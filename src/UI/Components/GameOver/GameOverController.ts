namespace StoryScript {
    export class GameOverController implements ng.IComponentController {
        constructor(private _gameService: IGameService, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        restart = (): void => this._gameService.restart();
    }

    GameOverController.$inject = ['gameService', 'game', 'customTexts'];
}