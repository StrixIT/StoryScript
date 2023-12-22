import { Injectable, inject } from '@angular/core';
import { ITrade, IAction, ActionType, IPerson, IEnemy, ICombinable, IItem } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { TradeService } from 'storyScript/Services/TradeService';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IGame } from 'storyScript/Interfaces/game';
import { Subject } from 'rxjs';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { ModalService } from './ModalService';

@Injectable()
export class SharedMethodService {
    private _gameService: GameService;
    private _conversationService: ConversationService;
    private _tradeService: TradeService;

    private combinationSource = new Subject<boolean>();

    constructor() {
        // Warning: the modal service needs to be injected so it gets created. Without this, the modal won't show!
        const modalService = inject(ModalService);
        const objectFactory = inject(ObjectFactory);
        this._gameService = inject(GameService);
        this._conversationService = inject(ConversationService);
        this._tradeService = inject(TradeService);
        this.game = objectFactory.GetGame();
    }

    game: IGame;
    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;

    combinationChange$ = this.combinationSource.asObservable();

    setCombineState = (value: boolean): void => this.combinationSource.next(value);

    enemiesPresent = (): boolean => this.game.currentLocation?.activeEnemies?.length > 0;

    tryCombine = (combinable: ICombinable): boolean => {
        var result = this.game.combinations.tryCombine(combinable);
        this.combinationSource.next(result);
        return result;
    }

    talk = (person: IPerson): void => {
        this._conversationService.talk(person);
    }

    trade = (trade: IPerson | ITrade): boolean => {
        var locationTrade = <ITrade>trade;

        if (locationTrade && !(<any>locationTrade).type && locationTrade.id) {
            trade = this.game.currentLocation.trade.find(t => t.id === locationTrade.id);
        }

        this._tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    hasDescription = (entity: { id?: string, description?: string }): boolean => this._gameService.hasDescription(entity);

    showDescription = (type: string, item: any, title: string): void => {
        this.game.currentDescription = { title: title, type: type, item: item };
    }

    startCombat = (person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            this.game.currentLocation.persons.delete(person);
            this.game.currentLocation.enemies.add(person);
        }

        this.game.combatLog = [];
        this._gameService.initCombat();
    }

    fight = (enemy: IEnemy): Promise<void> | void => {
        return this._gameService.fight(enemy);
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

    executeAction = (action: IAction, component: any): void => {
        if (action && action.execute) {
            // Modify the arguments collection to add the game to the collection before calling the function specified.
            var args = <any[]>[this.game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            var executeFunc = typeof action.execute !== 'function' ? component[action.execute] : action.execute;
            var result = executeFunc.apply(component, args);

            var typeAndIndex = this.getActionIndex(action);

            if (!result && typeAndIndex.index !== -1) {

                if (typeAndIndex.type === ActionType.Regular && this.game.currentLocation.actions) {
                    this.game.currentLocation.actions.splice(typeAndIndex.index, 1);
                } else if (typeAndIndex.type === ActionType.Combat && this.game.currentLocation.combatActions) {
                    this.game.currentLocation.combatActions.splice(typeAndIndex.index, 1);
                }
            }

            // After each action, save the game.
            this._gameService.saveGame();
        }
    }

    showEquipment = (): boolean => {
        return this.useEquipment && this.game.character && Object.keys(this.game.character.equipment).some(k => (<any>this.game.character.equipment)[k] !== undefined);
    }

    canUseItem = (item: IItem): boolean => item.use && (!item.canUse || item.canUse(this.game, item));
    
    private getActionIndex = (action: IAction): { type: number, index: number} => {
        var index = -1;
        var result = {
            index: index,
            type: 0
        };

        this.game.currentLocation.actions.forEach((a, i) => {
            if (a === action) {
                result = {
                    index: i,
                    type: 0
                }
            }
        });

        if (index == -1) {
            this.game.currentLocation.combatActions.forEach((a, i) => {
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