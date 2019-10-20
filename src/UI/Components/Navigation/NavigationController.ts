namespace StoryScript {
    export class NavigationController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _game: IGame, _texts: IInterfaceTexts) {
            this.texts = _texts;
        }

        texts: IInterfaceTexts;

        menu = (): PlayState => this._game.playState = PlayState.Menu;

        reset = (): void => this._gameService.reset();
    }

    NavigationController.$inject = ['gameService', 'game', 'customTexts'];
}