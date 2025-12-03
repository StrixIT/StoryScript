import {defineStore} from "pinia";
import {App, ref} from 'vue';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;
    
    const game = ref<IGame>(null);
    const texts = ref<IInterfaceTexts>(null);
    const rules = ref<IRules>(null);

    const useBackpack = ref(false);
    const useGround = ref(false);
    const useEquipment = ref(false);
    const useCharacterSheet = ref(false);
    const useQuests = ref(false);

    const error = ref<{ stackTrace: string, message: string }>(null);

    const initErrorHandling = (app: App<Element>) => {
        addEventListener("error", event => {
            error.value = { message: event.message, stackTrace: event.error.stack };
            event.stopPropagation();
        });
        addEventListener("unhandledrejection", event => {
            error.value = { message: event.reason.message, stackTrace: event.reason.stack };
            event.stopPropagation();
        });

        app.config.errorHandler = (error: any) => error.value = { message: error.message, stackTrace: error.stack };
    }
    
    const setStoreData = (factory: ServiceFactory) => {
        serviceFactory = factory;
        game.value = serviceFactory.GetGame();
        
        // THIS LINE IS CRUCIAL! It ensures the proxy object created by Vue is used throughout the application.
        // Without this, reactivity doesn't work!
        serviceFactory.init(game.value);
        
        texts.value = serviceFactory.GetTexts();
        rules.value = serviceFactory.GetRules();
    }

    const setActiveCharacter = (character: ICharacter) => game.value.activeCharacter = character;

    return {
        error,
        game,
        texts,
        rules,
        useGround,
        useBackpack,
        useEquipment,
        useCharacterSheet,
        useQuests,
        initErrorHandling,
        setStoreData,
        setActiveCharacter
    }
});