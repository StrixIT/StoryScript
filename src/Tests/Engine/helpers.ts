import {IInterfaceTexts, ILocalStorageService, importAssets, IRules} from 'storyScript';
import {ServiceFactory} from "src/Engine/ServiceFactory";
import {buildEntities} from "src/Engine/EntityCreatorFunctions";
import {addArrayExtensions, addFunctionExtensions} from "src/Engine/arrayAndFunctionExtensions";
import {Rules as MyRolePlayingGameRules} from "./assets/MyRolePlayingGame/rules";
import {
    CustomTexts as MyRolePlayingGameCustomTexts,
    CustomTexts as MyAdventureGameCustomTexts
} from "./assets/MyRolePlayingGame/customTexts";
import {Rules as MyAdventureGameRules} from "./assets/MyAdventureGame/rules";

export const initMyRolePlayingGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './assets/MyRolePlayingGame/locations/**/*',
        './assets/MyRolePlayingGame/enemies/**/*',
        './assets/MyRolePlayingGame/items/**/*',
        './assets/MyRolePlayingGame/persons/**/*',
        './assets/MyRolePlayingGame/quests/**/*'
    ], {eager: true, caseSensitive: false});

    return initServiceFactory(modules, 'MyRolePlayingGame', MyRolePlayingGameRules(), MyRolePlayingGameCustomTexts());
}

export const initMyAdventureGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './assets/MyAdventureGame/locations/**/*',
        './assets/MyAdventureGame/features/**/*',
        './assets/MyAdventureGame/items/**/*'
    ], {eager: true, caseSensitive: false});

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