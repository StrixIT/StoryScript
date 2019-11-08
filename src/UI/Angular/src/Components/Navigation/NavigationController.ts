import { IGame, IInterfaceTexts, Enumerations } from '../../../../../Engine/Interfaces/storyScript';
import { IGameService } from '../../../../../Engine/Services/interfaces/services';

export class NavigationController implements ng.IComponentController {
    constructor(private _gameService: IGameService, private _game: IGame, _texts: IInterfaceTexts) {
        this.texts = _texts;
    }

    texts: IInterfaceTexts;

    menu = (): Enumerations.PlayState => this._game.playState = Enumerations.PlayState.Menu;

    reset = (): void => this._gameService.reset();
}

NavigationController.$inject = ['gameService', 'game', 'customTexts'];