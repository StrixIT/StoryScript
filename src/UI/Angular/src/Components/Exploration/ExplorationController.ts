import { IGame, IInterfaceTexts, IPerson, ITrade, IAction, Enumerations, IDestination } from '../../../../../Engine/Interfaces/storyScript';
import { ISharedMethodService } from '../../Services/SharedMethodService';
import { IGameService } from '../../../../../Engine/Services/interfaces/services';
import { IBarrier } from '../../../../../Engine/Interfaces/barrier';
import { isEmpty } from '../../../../../Engine/utilities';

export class ExplorationController implements ng.IComponentController {
    constructor(private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, _texts: IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: IGame;
    texts: IInterfaceTexts;

    trade = (game, trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);

    changeLocation = (location: string): void => this.game.changeLocation(location, true);

    actionsPresent = (): boolean => this.game.currentLocation && !this.enemiesPresent() && !isEmpty(this.game.currentLocation.actions);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    getCombineClass = (barrier: IBarrier): string => this._game.combinations.getCombineClass(barrier);

    disableActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == Enumerations.ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == Enumerations.ActionStatus.Disabled;

    hideActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == Enumerations.ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == Enumerations.ActionStatus.Unavailable;

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(this.game, action, this);

    executeBarrierAction = (barrier: IBarrier, destination: IDestination): void => {
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