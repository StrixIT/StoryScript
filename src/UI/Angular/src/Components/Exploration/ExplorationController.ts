import StoryScript from '../../../../../types/storyscript';
import { ISharedMethodService } from '../../Services/SharedMethodService';

export class ExplorationController implements ng.IComponentController {
    constructor(private _gameService: StoryScript.IGameService, private _sharedMethodService: ISharedMethodService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    trade = (game, trade: StoryScript.IPerson | StoryScript.ITrade): boolean => this._sharedMethodService.trade(trade);

    changeLocation = (location: string): void => this.game.changeLocation(location, true);

    actionsPresent = (): boolean => this.game.currentLocation && !this.enemiesPresent() && !StoryScript.isEmpty(this.game.currentLocation.actions);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: StoryScript.IAction): string => this._sharedMethodService.getButtonClass(action);

    getCombineClass = (barrier: StoryScript.IBarrier): string => this._game.combinations.getCombineClass(barrier);

    disableActionButton = (action: StoryScript.IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == StoryScript.ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == StoryScript.ActionStatus.Disabled;

    hideActionButton = (action: StoryScript.IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == StoryScript.ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == StoryScript.ActionStatus.Unavailable;

    executeAction = (action: StoryScript.IAction): void => this._sharedMethodService.executeAction(action, this);

    executeBarrierAction = (barrier: StoryScript.IBarrier, destination: StoryScript.IDestination): void => {
        if (this._game.combinations.tryCombine(barrier))
        {
            return;
        }
        else if (this._game.combinations.activeCombination) {
            return;
        }

        this._gameService.executeBarrierAction(barrier, destination);
    }
}

ExplorationController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];