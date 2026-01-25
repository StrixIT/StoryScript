import {defineStore} from "pinia";
import {App, computed, ref} from 'vue';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {ICompiledLocation} from "storyScript/Interfaces/compiledLocation.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {ITrade} from "storyScript/Interfaces/trade.ts";
import {ISoundService} from "storyScript/Interfaces/services/ISoundService.ts";
import {IItemService} from "storyScript/Interfaces/services/itemService.ts";
import {ICombatService} from "storyScript/Interfaces/services/combatService.ts";
import {ICharacterService} from "storyScript/Interfaces/services/characterService.ts";
import {ICombinationService} from "storyScript/Interfaces/services/combinationService.ts";
import {IGameService} from "storyScript/Interfaces/services/gameService.ts";
import {IConversationService} from "storyScript/Interfaces/services/conversationService.ts";
import {ITradeService} from "storyScript/Interfaces/services/tradeService.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {gameEvents} from "storyScript/gameEvents.ts";
import {Error} from "ui/error.ts";
import {isDevelopment} from "../../constants.ts";

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;

    const error = ref<Error>(null);
    const availableLocations = ref<{ id: string, name: string }[]>();

    const game = ref<IGame>(<IGame>{});
    
    const runningDemo = ref<boolean>(false);

    const useBackpack = ref(false);
    const useGround = ref(false);
    const useEquipment = ref(false);
    const useCharacterSheet = ref(false);
    const useQuests = ref(false);

    const enemiesPresent = computed(() => game.value.currentLocation?.enemies.filter(e => !e.inactive).length > 0);
    const activePersons = computed(() => game.value.currentLocation?.persons.filter(e => !e.inactive) || []);
    const activeEnemies = computed(() => game.value.currentLocation?.enemies.filter(e => !e.inactive) || []);
    const activeItems = computed(() => game.value.currentLocation?.items.filter(e => !e.inactive) || []);
    const activeActions = computed(() => game.value.currentLocation?.actions.filter(i => !i[1].inactive) || []);
    const activeDestinations = computed(() => game.value.currentLocation?.destinations.filter(e => !e.inactive) || []);

    const services = {
        soundService: <ISoundService>null,
        itemService: <IItemService>null,
        combatService: <ICombatService>null,
        characterService: <ICharacterService>null,
        combinationService: <ICombinationService>null,
        gameService: <IGameService>null,
        conversationService: <IConversationService>null,
        tradeService: <ITradeService>null,
        dataService: <IDataService>null,
        texts: <IInterfaceTexts>null,
        rules: <IRules>null
    };

    const initErrorHandling = (app: App<Element>) => {
        addEventListener("error", event => {
            error.value = {message: event.message, stackTrace: event.error.stack};
            event.stopPropagation();
        });
        addEventListener("unhandledrejection", event => {
            error.value = {message: event.reason.message, stackTrace: event.reason.stack};
            event.stopPropagation();
        });

        if (!isDevelopment) {
            app.config.errorHandler = (e: any, vm, info) => error.value = {
                message: e.message,
                info: info,
                stackTrace: e.stack
            };
        }
    }

    const setStoreData = (factory: ServiceFactory) => {
        serviceFactory = factory;

        // THIS LINE IS CRUCIAL! It ensures the proxy object created by Vue is used throughout the application.
        // Without this, reactivity doesn't work!
        serviceFactory.init(game.value);

        services.texts = serviceFactory.GetTexts();
        services.rules = serviceFactory.GetRules();
        services.soundService = serviceFactory.GetSoundService();
        services.itemService = serviceFactory.GetItemService();
        services.combatService = serviceFactory.GetCombatService();
        services.characterService = serviceFactory.GetCharacterService();
        services.combinationService = serviceFactory.GetCombinationService();
        services.gameService = serviceFactory.GetGameService();
        services.conversationService = serviceFactory.GetConversationService();
        services.tradeService = serviceFactory.GetTradeService();
        services.dataService = serviceFactory.GetDataService();
        availableLocations.value = serviceFactory.AvailableLocations.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    const setActiveCharacter = (character: ICharacter) => {
        game.value.activeCharacter = character;
    }

    const trade = (location: ICompiledLocation, trade: IPerson | ITrade): boolean => {
        const locationTrade = <ITrade>trade;

        if (locationTrade && !(<any>locationTrade).type && Array.isArray(locationTrade)) {
            trade = location.trade.find(t => t.id === locationTrade[0]);
        }

        services.tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    const showEquipment = (character: ICharacter): boolean =>
        useEquipment
        && character?.equipment
        && Object.keys(character.equipment)
            .some(k => (<any>character.equipment)[k] !== undefined);

    const showDescription = (type: string, item: any, title: string): void => {
        game.value.currentDescription = {title: title, type: type, item: item};
    }

    const startCombat = (location: ICompiledLocation, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            location.persons.delete(person);
            location.enemies.add(person);
        }

        services.combatService.initCombat();
    }

    const getButtonClass = (action: [string, IAction]): string => {
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

    const executeAction = (action: [string, IAction]): void => {
        const execute = action[1]?.execute;

        if (execute) {
            let result = true;

            if (typeof execute === 'function') {
                const actionResult = execute(game.value);
                result = actionResult === true;
            } else {
                gameEvents.publish(execute, action);
            }

            const typeAndIndex = getActionIndex(game.value, action);

            if (!result && typeAndIndex.index !== -1) {
                if (typeAndIndex.type === ActionType.Regular && game.value.currentLocation.actions) {
                    const currentAction = game.value.currentLocation.actions[typeAndIndex.index];
                    game.value.currentLocation.actions.delete(currentAction);
                } else if (typeAndIndex.type === ActionType.Combat && game.value.currentLocation.combatActions) {
                    const currentCombatAction = game.value.currentLocation.combatActions[typeAndIndex.index];
                    game.value.currentLocation.combatActions.delete(currentCombatAction);
                }
            }

            // After each action, save the game.
            services.dataService.saveGame(game.value)
        }
    }

    return {
        error,
        game,
        runningDemo,
        useGround,
        useBackpack,
        useEquipment,
        useCharacterSheet,
        useQuests,
        services,
        availableLocations,
        enemiesPresent,
        activePersons,
        activeEnemies,
        activeItems,
        activeActions,
        activeDestinations,
        initErrorHandling,
        setStoreData,
        setActiveCharacter,
        showEquipment,
        showDescription,
        getButtonClass,
        executeAction,
        trade,
        startCombat
    }
});

const getActionIndex = (game: IGame, action: [string, IAction]): { type: ActionType, index: number } => {
    let index = -1;
    let type = ActionType.Regular;

    game.currentLocation.actions.forEach(([k, v], i) => {
        if (k === action[0]) {
            index = i;
            type = ActionType.Regular;
        }
    });

    if (index == -1) {
        game.currentLocation.combatActions.forEach(([k, v], i) => {
            if (k === action[0]) {
                index = i;
                type = ActionType.Combat;
            }
        });
    }

    return {type, index};
}