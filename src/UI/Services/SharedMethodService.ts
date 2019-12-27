import { Injectable } from '@angular/core';
import { ITrade, IAction, PlayState, ActionType, IPerson, IEnemy, ICombinable } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { TradeService } from 'storyScript/Services/TradeService';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IGame } from 'storyScript/Interfaces/game';
import { ModalService } from './ModalService';
import { Subject } from 'rxjs';

@Injectable()
export class SharedMethodService {
    private combinationSource = new Subject<boolean>();

    // Warning: the modal service needs to be injected so it gets created. Without this, the modal won't show!
    constructor(_modalService: ModalService, private _gameService: GameService, private _conversationService: ConversationService, private _tradeService: TradeService) {
    }

    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;

    combinationChange$ = this.combinationSource.asObservable();

    setCombineState = (value: boolean): void => this.combinationSource.next(value);

    enemiesPresent = (game: IGame): boolean => game.currentLocation?.activeEnemies?.length > 0;

    tryCombine = (game: IGame, combinable: ICombinable): boolean => {
        var result = game.combinations.tryCombine(combinable);
        this.combinationSource.next(result);
        return result;
    }

    talk = (game: IGame, person: IPerson): void => {
        this._conversationService.talk(person);
    }

    trade = (game: IGame, trade: IPerson | ITrade): boolean => {
        var locationTrade = <ITrade>trade;

        if (locationTrade && !(<any>locationTrade).type && locationTrade.id) {
            trade = game.currentLocation.trade.find(t => t.id === locationTrade.id);
        }

        this._tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    hasDescription = (entity: { id?: string, description?: string }): boolean => this._gameService.hasDescription(entity);

    showDescription = (game: IGame, type: string, item: any, title: string): void => {
        this._gameService.setCurrentDescription(type, item, title);
    }

    startCombat = (game: IGame, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            game.currentLocation.persons.remove(person);
            game.currentLocation.enemies.push(person);
        }

        game.combatLog = [];
        this._gameService.initCombat();
    }

    fight = (game: IGame, enemy: IEnemy): void => {
        this._gameService.fight(enemy);
    }

    getButtonClass = (action: IAction): string => {
        var type = action.actionType || ActionType.Regular;
        var buttonClass = 'btn-';

        switch (type) {
            case ActionType.Regular: {
                buttonClass += 'info'
            } break;
            case ActionType.Check: {
                buttonClass += 'warning';
            } break;
            case ActionType.Combat: {
                buttonClass += 'danger';
            } break;
            case ActionType.Trade: {
                buttonClass += 'secondary';
            } break;
        }

        return buttonClass;
    }

    executeAction = (game: IGame, action: IAction, component: any): void => {
        if (action && action.execute) {
            // Modify the arguments collection to add the game to the collection before calling the function specified.
            var args = <any[]>[game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            var executeFunc = typeof action.execute !== 'function' ? component[action.execute] : action.execute;
            var result = executeFunc.apply(component, args);

            var typeAndIndex = this.getActionIndex(game, action);

            if (!result && typeAndIndex.index !== -1) {

                if (typeAndIndex.type === ActionType.Regular && game.currentLocation.actions) {
                    game.currentLocation.actions.splice(typeAndIndex.index, 1);
                } else if (typeAndIndex.type === ActionType.Combat && game.currentLocation.combatActions) {
                    game.currentLocation.combatActions.splice(typeAndIndex.index, 1);
                }
            }

            // After each action, save the game.
            this._gameService.saveGame();
        }
    }

    showEquipment = (game: IGame): boolean => {
        return this.useEquipment && game.character && Object.keys(game.character.equipment).some(k => (<any>game.character.equipment)[k] !== undefined);
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