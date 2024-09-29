import {inject, Injectable} from '@angular/core';
import {ActionType, IAction, ICharacter, ICombinable, IItem, IPerson, ITrade} from 'storyScript/Interfaces/storyScript';
import {TradeService} from 'storyScript/Services/TradeService';
import {ConversationService} from 'storyScript/Services/ConversationService';
import {IGame} from 'storyScript/Interfaces/game';
import {Subject} from 'rxjs';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {ModalService} from './ModalService';
import {CombatService} from "storyScript/Services/CombatService.ts";
import {hasDescription} from 'storyScript/Services/sharedFunctions';
import {DataService} from "storyScript/Services/DataService.ts";

@Injectable()
export class SharedMethodService {
    private _dataService: DataService;
    private _combatService: CombatService;
    private _conversationService: ConversationService;
    private _tradeService: TradeService;

    private combinationSource = new Subject<boolean>();

    constructor() {
        // Warning: the modal service needs to be injected so it gets created. Without this, the modal won't show!
        inject(ModalService);
        const objectFactory = inject(ServiceFactory);
        this._dataService = inject(DataService);
        this._combatService = inject(CombatService);
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
        const result = this.game.combinations.tryCombine(combinable);
        this.combinationSource.next(result.success);
        return result.success;
    }

    talk = (person: IPerson): void => {
        this._conversationService.talk(person);
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

    hasDescription = (entity: {
        id?: string,
        description?: string
    }): boolean => hasDescription(entity);

    showDescription = (type: string, item: any, title: string): void => {
        this.game.currentDescription = {title: title, type: type, item: item};
    }

    startCombat = (person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            this.game.currentLocation.persons.delete(person);
            this.game.currentLocation.enemies.add(person);
        }

        this.game.combatLog = [];
        this._combatService.initCombat();
    }

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

    showEquipment = (character: ICharacter): boolean => {
        return this.useEquipment && character && Object.keys(character.equipment).some(k => (<any>character.equipment)[k] !== undefined);
    }

    canUseItem = (character: ICharacter, item: IItem): boolean => item.use && (!item.canUse || item.canUse(this.game, character, item));

    private getActionIndex = (action: [string, IAction]): { type: ActionType, index: number } => {
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