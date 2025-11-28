import {defineStore} from "pinia";
import {ref} from 'vue';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;
    const game = ref<IGame>(null);
    const texts = ref<IInterfaceTexts>(null);
    const rules = ref<IRules>(null);
    
    const setStoreData = (factory: ServiceFactory) => {
        serviceFactory = factory;
        game.value = serviceFactory.GetGame();
        texts.value = serviceFactory.GetTexts();
        rules.value = serviceFactory.GetRules();
    }
    
    return {
        game,
        texts,
        rules,
        setStoreData
    }
});