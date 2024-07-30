import { Injectable, inject } from '@angular/core';
import { ITrade, IAction, ActionType, IPerson, ICombinable, IItem, ICharacter } from 'storyScript/Interfaces/storyScript';
import { GameService } from 'storyScript/Services/gameService';
import { TradeService } from 'storyScript/Services/TradeService';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { IGame } from 'storyScript/Interfaces/game';
import { Subject } from 'rxjs';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
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
        const objectFactory = inject(ServiceFactory);
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

        if (locationTrade && !(<any>locationTrade).type && Array.isArray(locationTrade)) {
            trade = this.game.currentLocation.trade.find(t => t.id === locationTrade[0]);
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

    getButtonClass = (action: [string, IAction]): string => {
        var type = action[1].actionType || ActionType.Regular;
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
            this._gameService.saveGame();
        }
    }

    showEquipment = (character: ICharacter): boolean => {
        return this.useEquipment && character && Object.keys(character.equipment).some(k => (<any>character.equipment)[k] !== undefined);
    }

    canUseItem = (character: ICharacter, item: IItem): boolean => item.use && (!item.canUse || item.canUse(this.game, character, item));
    
    private getActionIndex = (action: [string, IAction]): { type: number, index: number} => {
        let index = -1;
        let type = -1;

        this.game.currentLocation.actions.forEach(([k, v], i) => {
            if (k === action[0]) {
                index = i;
                type = 0;
            }
        });

        if (index == -1) {
            this.game.currentLocation.combatActions.forEach(([k, v], i) => {
                if (k === action[0]) {
                    index = i;
                    type = 2;
                }
            });
        }

        return { type, index };
    }
}