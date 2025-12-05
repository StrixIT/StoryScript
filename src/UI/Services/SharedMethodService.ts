import {inject, Injectable} from '@angular/core';
import {ActionType, IAction, ICombinable, IPerson, ITrade} from 'storyScript/Interfaces/storyScript';
import {TradeService} from 'storyScript/Services/TradeService';
import {IGame} from 'storyScript/Interfaces/game';
import {Subject} from 'rxjs';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {DataService} from "storyScript/Services/DataService.ts";

@Injectable()
export class SharedMethodService {
    game: IGame;
    private readonly _dataService: DataService;
    private readonly _tradeService: TradeService;
    private readonly combinationSource = new Subject<boolean>();

    constructor() {
        const objectFactory = inject(ServiceFactory);
        this._dataService = inject(DataService);
        this._tradeService = inject(TradeService);
        this.game = objectFactory.GetGame();
    }

    enemiesPresent = (): boolean => this.game.currentLocation?.activeEnemies?.length > 0;

    tryCombine = (combinable: ICombinable): boolean => {
        const result = this.game.combinations.tryCombine(combinable);
        this.combinationSource.next(result.success);
        return result.success;
    }

    trade = (trade: IPerson | ITrade): boolean => {
        const locationTrade = <ITrade>trade;

        if (locationTrade && !(<any>locationTrade).type && Array.isArray(locationTrade)) {
            trade = this.game.currentLocation.trade.find(t => t.id === locationTrade[0]);
        }

        this._tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    getButtonClass = (action: [string, IAction]): string => {
        const type = action[1].actionType || ActionType.Regular;
        let buttonClass = 'btn-';

        switch (type) {
            case ActionType.Regular:
                buttonClass += 'info'
                break;
            case ActionType.Check:
                buttonClass += 'warning';
                break;
            case ActionType.Combat:
                buttonClass += 'danger';
                break;
            case ActionType.Trade:
                buttonClass += 'secondary';
                break;
        }

        return buttonClass;
    }

    executeAction = (action: [string, IAction], component: any): void => {
        const execute = action?.[1]?.execute;

        if (execute) {
            // Modify the arguments collection to add the game to the collection before calling the function specified.
            const args = <any[]>[this.game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            const executeFunc = typeof execute !== 'function' ? component[execute] : execute;
            const result = executeFunc.apply(component, args);

            const typeAndIndex = this.getActionIndex(action);

            if (!result && typeAndIndex.index !== -1) {
                if (typeAndIndex.type === ActionType.Regular && this.game.currentLocation.actions) {
                    const currentAction = this.game.currentLocation.actions[typeAndIndex.index];
                    this.game.currentLocation.actions.delete(currentAction);
                } else if (typeAndIndex.type === ActionType.Combat && this.game.currentLocation.combatActions) {
                    const currentCombatAction = this.game.currentLocation.combatActions[typeAndIndex.index];
                    this.game.currentLocation.combatActions.delete(currentCombatAction);
                }
            }

            // After each action, save the game.
            this._dataService.saveGame(this.game);
        }
    }

    private readonly getActionIndex = (action: [string, IAction]): { type: ActionType, index: number } => {
        let index = -1;
        let type = ActionType.Regular;

        this.game.currentLocation.actions.forEach(([k, v], i) => {
            if (k === action[0]) {
                index = i;
                type = ActionType.Regular;
            }
        });

        if (index == -1) {
            this.game.currentLocation.combatActions.forEach(([k, v], i) => {
                if (k === action[0]) {
                    index = i;
                    type = ActionType.Combat;
                }
            });
        }

        return {type, index};
    }
}