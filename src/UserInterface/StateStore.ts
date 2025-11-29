import {defineStore} from "pinia";
import {ref, unref} from 'vue';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {IGameService} from "storyScript/Interfaces/services/gameService.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

export const useStateStore = defineStore('appState', () => {
    let serviceFactory: ServiceFactory;

    let gameService: IGameService;
    let dataService: IDataService;

    const reloadKey = ref(0);
    const game = ref<IGame>(null);
    const texts = ref<IInterfaceTexts>(null);
    const rules = ref<IRules>(null);

    const useGround = ref(false);

    const setStoreData = (factory: ServiceFactory) => {
        serviceFactory = factory;
        game.value = serviceFactory.GetGame();
        
        // THIS LINE IS CRUCIAL! It ensures the proxy object created by Vue is used throughout the application.
        // Without this, reactivity doesn't work!
        serviceFactory.init(game.value);
        
        texts.value = serviceFactory.GetTexts();
        rules.value = serviceFactory.GetRules();

        gameService = serviceFactory.GetGameService();
        dataService = serviceFactory.GetDataService();
    }

    const setActiveCharacter = (character: ICharacter) => game.value.activeCharacter = character;

    const reset = (): void => gameService.reset();

    const restart = (): void => gameService.restart();

    const getSaveKeys = () => dataService.getSaveKeys();

    const saveGame = (gameName?: string): void => dataService.saveGame(<IGame>game.value, gameName);

    const loadGame = (gameName: string): void => gameService.loadGame(gameName);

    const getSoundService = () => serviceFactory.GetSoundService();

    const getItemService = () => serviceFactory.GetItemService();

    const getCombatService = () => serviceFactory.GetCombatService();

    const getCharacterService = () => serviceFactory.GetCharacterService();

    const getGameService = () => serviceFactory.GetGameService();

    return {
        reloadKey,
        game,
        texts,
        rules,
        useGround,
        setStoreData,
        setActiveCharacter,
        reset,
        restart,
        getSaveKeys,
        saveGame,
        loadGame,
        getSoundService,
        getItemService,
        getCharacterService,
        getGameService,
        getCombatService
    }
});