import {ILocalStorageService} from "../../Engine/Interfaces/services/localStorageService";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {buildEntities} from "storyScript/EntityCreatorFunctions.ts";
import {importAssets} from "storyScript/run.ts";
import {Rules} from "./assets/MyRolePlayingGame/rules.ts";
import {CustomTexts} from "./assets/MyRolePlayingGame/customTexts.ts";
import {addArrayExtensions, addFunctionExtensions} from "storyScript/arrayAndFunctionExtensions.ts";

export const initServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([

        './assets/MyRolePlayingGame/locations/**/*.ts',
        './assets/MyRolePlayingGame/enemies/**/*.ts',
        './assets/MyRolePlayingGame/items/**/*.ts',
        './assets/MyRolePlayingGame/persons/**/*.ts',
        './assets/MyRolePlayingGame/quests/**/*.ts',
    ], {eager: true});

    addFunctionExtensions();
    addArrayExtensions();
    const definitions = importAssets(modules);
    const registeredEntities = buildEntities(definitions);
    new ServiceFactory('MyTestGame', definitions, registeredEntities, Rules(), CustomTexts());
    let factory = ServiceFactory.GetInstance();
    factory.init();
    return factory;
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