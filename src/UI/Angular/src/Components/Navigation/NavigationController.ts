import StoryScript from '../../../../../types/storyscript';

export class NavigationController implements ng.IComponentController {
    constructor(private _gameService: StoryScript.IGameService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.texts = _texts;
    }

    texts: StoryScript.IInterfaceTexts;

    menu = (): StoryScript.PlayState => this._game.playState = StoryScript.PlayState.Menu;

    reset = (): void => this._gameService.reset();
}

NavigationController.$inject = ['gameService', 'game', 'customTexts'];