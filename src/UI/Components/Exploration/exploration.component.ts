import {
    ActionStatus,
    IAction,
    IBarrier,
    IBarrierAction,
    IDestination,
    IGame,
    IInterfaceTexts,
    IPerson,
    ITrade
} from 'storyScript/Interfaces/storyScript';
import {isEmpty} from 'storyScript/utilityFunctions';
import {SharedMethodService} from '../../Services/SharedMethodService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {DataService} from "storyScript/Services/DataService.ts";

@Component({
    selector: 'exploration',
    template: getTemplate('exploration', await import('./exploration.component.html?raw'))
})
export class ExplorationComponent {
    private _dataService: DataService;
    private _sharedMethodService: SharedMethodService;

    constructor() {
        this._dataService = inject(DataService);
        this._sharedMethodService = inject(SharedMethodService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    changeLocation = (location: string): void => this.game.changeLocation(location, true);

    actionsPresent = (): boolean => this.game.currentLocation && !this.enemiesPresent() && !isEmpty(this.game.currentLocation.actions);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: [string, IAction]): string => this._sharedMethodService.getButtonClass(action);

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    disableActionButton = (action: [string, IAction]): boolean => typeof action[1].status === 'function' ? (<any>action).status(this.game) == ActionStatus.Disabled : action[1].status == undefined ? false : action[1].status == ActionStatus.Disabled;

    hideActionButton = (action: [string, IAction]): boolean => typeof action[1].status === 'function' ? (<any>action).status(this.game) == ActionStatus.Unavailable : action[1].status == undefined ? false : action[1].status == ActionStatus.Unavailable;

    executeAction = (action: [string, IAction]): void => this._sharedMethodService.executeAction(action, this);

    // Do not remove this method nor its arguments, it is called dynamically from the executeAction method of the SharedMethodService!
    trade = (_: IGame, trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);

    executeBarrierAction = (barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void => {
        if (this.game.combinations.tryCombine(barrier[1]).success || this.game.combinations.activeCombination) {
            return;
        }

        action[1].execute(this.game, barrier, destination);
        barrier[1].actions.delete(barrier[1].actions.find(([k, _]) => k === action[0]));
        this._dataService.saveGame(this.game);
    }

    isPreviousLocation = (destination: IDestination): boolean => {
        return (<any>destination).isPreviousLocation
    };
}