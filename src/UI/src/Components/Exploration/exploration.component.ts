import { IGame, IInterfaceTexts, IPerson, ITrade, IAction, Enumerations, IDestination, IBarrier, IBarrierAction } from '../../../../Engine/Interfaces/storyScript';
import { isEmpty } from '../../../../Engine/utilities';
import { GameService } from '../../../../Engine/Services/gameService';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';
import { Component } from '@angular/core';
import template from './exploration.component.html';

@Component({
    selector: 'exploration',
    template: template,
})
export class ExplorationComponent {
    constructor(private _gameService: GameService, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    trade = (game, trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(this.game, trade);

    changeLocation = (location: string): void => this.game.changeLocation(location, true);

    actionsPresent = (): boolean => this.game.currentLocation && !this.enemiesPresent() && !isEmpty(this.game.currentLocation.actions);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    disableActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == Enumerations.ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == Enumerations.ActionStatus.Disabled;

    hideActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == Enumerations.ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == Enumerations.ActionStatus.Unavailable;

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(this.game, action, this);

    executeBarrierAction = (barrier: IBarrier, action: IBarrierAction, destination: IDestination): void => {
        if (this.game.combinations.tryCombine(barrier))
        {
            return;
        }
        else if (this.game.combinations.activeCombination) {
            return;
        }

        this._gameService.executeBarrierAction(barrier, action, destination);
    }
}