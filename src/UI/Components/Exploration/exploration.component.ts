import { IGame, IInterfaceTexts, IPerson, ITrade, IAction, IDestination, IBarrier, IBarrierAction, ActionStatus } from 'storyScript/Interfaces/storyScript';
import { isEmpty } from 'storyScript/utilities';
import { GameService } from 'storyScript/Services/gameService';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
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

    changeLocation = (location: string): void => this.game.changeLocation(location, true);

    actionsPresent = (): boolean => this.game.currentLocation && !this.enemiesPresent() && !isEmpty(this.game.currentLocation.actions);

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

    getCombineClass = (barrier: IBarrier): string => this.game.combinations.getCombineClass(barrier);

    disableActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == ActionStatus.Disabled;

    hideActionButton = (action: IAction): boolean => typeof action.status === 'function' ? (<any>action).status(this.game) == ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == ActionStatus.Unavailable;

    executeAction = (action: IAction): void => this._sharedMethodService.executeAction(this.game, action);

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