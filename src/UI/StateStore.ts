import {defineStore} from "pinia";
import {App, ref} from 'vue';
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

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;

    const game = ref<IGame>(<IGame>{});

    const useBackpack = ref(false);
    const useGround = ref(false);
    const useEquipment = ref(false);
    const useCharacterSheet = ref(false);
    const useQuests = ref(false);

    const error = ref<{ stackTrace: string, message: string }>(null);

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

        app.config.errorHandler = (error: any) => error.value = {message: error.message, stackTrace: error.stack};
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

    const startCombat = (location: ICompiledLocation, person?: IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            location.persons.delete(person);
            location.enemies.add(person);
        }

        services.combatService.initCombat();
    }

    const setActiveCharacter = (character: ICharacter) => game.value.activeCharacter = character;

    return {
        error,
        game,
        useGround,
        useBackpack,
        useEquipment,
        useCharacterSheet,
        useQuests,
        services,
        initErrorHandling,
        setStoreData,
        setActiveCharacter,
        trade,
        startCombat
    }
});