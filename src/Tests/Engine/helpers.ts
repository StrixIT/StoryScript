import {ILocalStorageService} from "../../Engine/Interfaces/services/localStorageService";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {buildEntities} from "storyScript/EntityCreatorFunctions.ts";
import {importAssets} from "storyScript/run.ts";
import {addArrayExtensions, addFunctionExtensions} from "storyScript/arrayAndFunctionExtensions.ts";
import { IRules, IInterfaceTexts } from "storyScript/Interfaces/storyScript.ts";
import {Rules as MyRolePlayingGameRules } from "./assets/MyRolePlayingGame/rules.ts";
import {CustomTexts as MyRolePlayingGameCustomTexts} from "./assets/MyRolePlayingGame/customTexts.ts";
import {Rules as MyAdventureGameRules } from "./assets/MyAdventureGame/rules.ts";
import {CustomTexts as MyAdventureGameCustomTexts} from "./assets/MyRolePlayingGame/customTexts.ts";

export const initMyRolePlayingGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './assets/MyRolePlayingGame/locations/**/*.ts',
        './assets/MyRolePlayingGame/enemies/**/*.ts',
        './assets/MyRolePlayingGame/items/**/*.ts',
        './assets/MyRolePlayingGame/persons/**/*.ts',
        './assets/MyRolePlayingGame/quests/**/*.ts'
    ], {eager: true});

    return initServiceFactory(modules, 'MyRolePlayingGame', MyRolePlayingGameRules(), MyRolePlayingGameCustomTexts());
}

export const initMyAdventureGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './assets/MyAdventureGame/locations/**/*.ts',
        './assets/MyAdventureGame/features/**/*.ts',
        './assets/MyAdventureGame/items/**/*.ts'
    ], {eager: true});

    return initServiceFactory(modules, 'MyAdventureGame', MyAdventureGameRules(), MyAdventureGameCustomTexts());
}

export const getStorageServiceMock = (): ILocalStorageService => {
    const storage = <Record<string, string>>{};

    return <ILocalStorageService>{
        set: function (key, data) {
            storage[key] = data;
        },
        get: function (key) {
            return storage[key];
        },
        remove: function (key) {
            delete storage[key];
        },
        getKeys: function () {
            return Object.keys(storage);
        }
    };
}

export const compareId = (id: string, func: string | Function): boolean => {
    const name = (func as Function).name || func as string;
    return id.toLowerCase() === name.toLowerCase();
}

const initServiceFactory = (modules: Record<string, unknown>, gameName: string, rules: IRules, texts: IInterfaceTexts) => {
    addFunctionExtensions();
    addArrayExtensions();
    const definitions = importAssets(modules);
    const registeredEntities = buildEntities(definitions);
    new ServiceFactory(gameName, definitions, registeredEntities, rules, texts);
    let factory = ServiceFactory.GetInstance();
    factory.init();
    return factory;
}