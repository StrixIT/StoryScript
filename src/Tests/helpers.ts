import {IInterfaceTexts, ILocalStorageService, IRules} from 'storyScript';
import {ServiceFactory} from "src/Engine/ServiceFactory";
import {buildEntities} from "src/Engine/EntityCreatorFunctions";
import {addArrayExtensions, addFunctionExtensions} from "src/Engine/arrayAndFunctionExtensions";
import {Rules as MyRolePlayingGameRules} from "./Engine/assets/MyRolePlayingGame/rules";
import {
    CustomTexts as MyRolePlayingGameCustomTexts,
    CustomTexts as MyAdventureGameCustomTexts
} from "./Engine/assets/MyRolePlayingGame/customTexts";
import {Rules as MyAdventureGameRules} from "./Engine/assets/MyAdventureGame/rules";
import {getDefinitions} from "ui/helpers";

export const initMyRolePlayingGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './Engine/assets/MyRolePlayingGame/locations/**/*.ts',
        './Engine/assets/MyRolePlayingGame/enemies/**/*.ts',
        './Engine/assets/MyRolePlayingGame/items/**/*.ts',
        './Engine/assets/MyRolePlayingGame/persons/**/*.ts',
        './Engine/assets/MyRolePlayingGame/quests/**/*.ts'
    ], {eager: true, caseSensitive: false});

    return initServiceFactory(modules, 'MyRolePlayingGame', MyRolePlayingGameRules(), MyRolePlayingGameCustomTexts());
}

export const initMyAdventureGameServiceFactory = (): ServiceFactory => {
    const modules = import.meta.glob([
        './Engine/assets/MyAdventureGame/locations/**/*.ts',
        './Engine/assets/MyAdventureGame/features/**/*.ts',
        './Engine/assets/MyAdventureGame/items/**/*.ts'
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
    
    const definitions = getDefinitions(modules);
    const registeredEntities = buildEntities(definitions);
    new ServiceFactory(gameName, definitions, registeredEntities, rules, texts);
    let factory = ServiceFactory.GetInstance();
    factory.init();
    return factory;
}