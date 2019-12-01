import { Injectable } from '@angular/core';
import { ITrade, IAction, Enumerations, IPerson, IEnemy, Combinations } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { TradeService } from 'storyScript/Services/TradeService';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IGame } from '../../../../Engine/Interfaces/game';
import { EventService } from './EventService';
import { ModalService } from './ModalService';

@Injectable()
export class SharedMethodService {

    constructor(private _eventService: EventService, private _modalService: ModalService, private _gameService: GameService, private _conversationService: ConversationService, private _tradeService: TradeService) {
    }

    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;

    setCombineState = this._eventService.setCombineState;

    enemiesPresent = (game: IGame): boolean => {
        var result = game.currentLocation && game.currentLocation.activeEnemies && game.currentLocation.activeEnemies.length > 0;

        if (result) {
            this._gameService.initCombat();
        }

        this._eventService.setEnemiesPresent(result);

        return result;
    }

    tryCombine = (game: IGame, combinable: Combinations.ICombinable): boolean => {
        var result = game.combinations.tryCombine(combinable);
        this._eventService.setCombineState(result);
        return result;
    }

    talk = (game: IGame, person: IPerson): void => {
        this._conversationService.talk(person);
        this.setPlayState(game, Enumerations.PlayState.Conversation);
    }

    trade = (game: IGame, trade: IPerson | ITrade): boolean => {
        this._tradeService.trade(trade);
        this.setPlayState(game, Enumerations.PlayState.Trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    showDescription = (game: IGame, type: string, item: any, title: string): void => {
        this._gameService.setCurrentDescription(type, item, title);
        this.setPlayState(game, Enumerations.PlayState.Description);
    }

    startCombat = (game: IGame, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            game.currentLocation.persons.remove(person);
            game.currentLocation.enemies.push(person);
        }

        game.combatLog = [];
        game.playState = Enumerations.PlayState.Combat;
        this.setPlayState(game, Enumerations.PlayState.Combat);
    }

    fight = (game: IGame, enemy: IEnemy): void => {
         this._gameService.fight(enemy);
         this.enemiesPresent(game);
    }

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

    executeAction = (game: IGame, action: IAction, component: any): void => {
        if (action && action.execute) {
            var currentState = game.playState;

            // Modify the arguments collection to add the game to the collection before calling the function specified.
            var args = <any[]>[game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            var executeFunc = typeof action.execute !== 'function' ? component[<string>action.execute] : action.execute;
            var result = executeFunc.apply(component, args);
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

            if (currentState && currentState !== game.playState) {
                this.setPlayState(game, game.playState);
            }
        }
    }

    showEquipment = (game: IGame): boolean => {
        return this.useEquipment && game.character && Object.keys(game.character.equipment).some(k => game.character.equipment[k] !== undefined);
    }

    setPlayState = (game: IGame, value: Enumerations.PlayState): void => {
        game.playState = value;
        this._eventService.setPlayState(value);    
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