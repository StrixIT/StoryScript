import { IGame, ITrade, IAction, Enumerations } from '../../../../Engine/Interfaces/storyScript';
import { Injectable } from '@angular/core';
import { GameService } from '../../../../Engine/Services/gameService';
import { TradeService } from '../../../../Engine/Services/TradeService';
import { Game } from '../../../../Games/_TestGame/interfaces/game';
import { IPerson } from '../../../../Games/_TestGame/interfaces/types';
import { ObjectFactory } from '../../../../Engine/ObjectFactory';

export interface ISharedMethodService {
    enemiesPresent(game: IGame): boolean;
    trade(trade: IPerson | ITrade): boolean;
    getButtonClass(action: IAction): string;
    executeAction(game: IGame, action: IAction, controller: ng.IComponentController): void;
    startCombat(game: IGame, person?: IPerson): void;
    showDescription(type: string, item: any, title: string): void;
    showEquipment(game: IGame): boolean;
    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;
}

@Injectable()
export class SharedMethodService implements ISharedMethodService {

    constructor(private _gameService: GameService, private _tradeService: TradeService) {
    }

    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;

    enemiesPresent = (game: IGame): boolean => {
        return game.currentLocation && game.currentLocation.activeEnemies && game.currentLocation.activeEnemies.length > 0;
    }

    trade = (trade: IPerson | ITrade): boolean => {
        this._tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    getButtonClass = (action: IAction): string => {
        var type = action.actionType || Enumerations.ActionType.Regular;
        var buttonClass = 'btn-';

        switch (type) {
            case Enumerations.ActionType.Regular: {
                buttonClass += 'info'
            } break;
            case Enumerations.ActionType.Check: {
                buttonClass += 'warning';
            } break;
            case Enumerations.ActionType.Combat: {
                buttonClass += 'danger';
            } break;
            case Enumerations.ActionType.Trade: {
                buttonClass += 'secondary';
            } break;
        }

        return buttonClass;
    }

    executeAction = (game: IGame, action: IAction, controller: ng.IComponentController): void => {
        if (action && action.execute) {
            // Modify the arguments collection to add the game to the collection before calling the function specified.
            var args = <any[]>[game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            var executeFunc = typeof action.execute !== 'function' ? controller[<string>action.execute] : action.execute;
            var result = executeFunc.apply(controller, args);
            var typeAndIndex = this.getActionIndex(game, action);

            if (!result && typeAndIndex.index !== -1) {

                if (typeAndIndex.type === Enumerations.ActionType.Regular && game.currentLocation.actions) {
                    game.currentLocation.actions.splice(typeAndIndex.index, 1);
                } else if (typeAndIndex.type === Enumerations.ActionType.Combat && game.currentLocation.combatActions) {
                    game.currentLocation.combatActions.splice(typeAndIndex.index, 1);
                }
            }

            // After each action, save the game.
            this._gameService.saveGame();
        }
    }

    startCombat = (game: IGame, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            game.currentLocation.persons.remove(person);
            game.currentLocation.enemies.push(person);
        }

        game.combatLog = [];
        game.playState = Enumerations.PlayState.Combat;
    }

    showDescription = (type: string, item: any, title: string): void => this._gameService.setCurrentDescription(type, item, title);

    showEquipment = (game: IGame): boolean => {
        return this.useEquipment && game.character && Object.keys(game.character.equipment).some(k => game.character.equipment[k] !== undefined);
    }
    
    private getActionIndex = (game: IGame, action: IAction): { type: number, index: number} => {
        var index = -1;
        var result = {
            index: index,
            type: 0
        };

        game.currentLocation.actions.forEach((a, i) => {
            if (a === action) {
                result = {
                    index: i,
                    type: 0
                }
            }
        });

        if (index == -1) {
            game.currentLocation.combatActions.forEach((a, i) => {
                if (a === action) {
                    result = {
                        index: i,
                        type: 2
                    }
                }
            });
        }

        return result;
    }
}

SharedMethodService.$inject = ['gameService', 'tradeService', 'game'];