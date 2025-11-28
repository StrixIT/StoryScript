import {defineStore} from "pinia";
import {ref, unref} from 'vue';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {IGameService} from "storyScript/Interfaces/services/gameService.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;
    
    let gameService: IGameService;
    let dataService: IDataService;
    
    const reloadKey = ref(0);
    const game = ref<IGame>(null);
    const texts = ref<IInterfaceTexts>(null);
    const rules = ref<IRules>(null);
    
    const setStoreData = (factory: ServiceFactory) => {
        serviceFactory = factory;
        game.value = serviceFactory.GetGame();
        texts.value = serviceFactory.GetTexts();
        rules.value = serviceFactory.GetRules();
        
        gameService = serviceFactory.GetGameService();
        dataService = serviceFactory.GetDataService();
    }
    
    const update = (action: Function) => {
        action();
        ++reloadKey.value;
    }
    
    const reset = (): void => gameService.reset();

    const restart = (): void => gameService.restart();
    
    const getSaveKeys = () => dataService.getSaveKeys();
    
    const saveGame = (gameName?: string): void => dataService.saveGame(<IGame>game.value, gameName);

    const loadGame = (gameName: string): void => gameService.loadGame(gameName);
    
    const getSoundService = () => serviceFactory.GetSoundService();
    
    return {
        reloadKey,
        game,
        texts,
        rules,
        setStoreData,
        update,
        reset,
        restart,
        getSaveKeys,
        saveGame,
        loadGame,
        getSoundService
    }
});