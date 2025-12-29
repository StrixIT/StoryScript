import { ILocalStorageService } from "../../Engine/Interfaces/services/localStorageService";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {RunGame} from "../../Games/MyRolePlayingGame/run.ts";

export const initServiceFactory = (): ServiceFactory => {
    let factory = ServiceFactory.GetInstance();
    
    if (!factory) {
        RunGame();
        factory = ServiceFactory.GetInstance();
        factory.init();
    } else if (!ServiceFactory.Initialized) {
        factory.init();
    }

    return factory;
}

export const getStorageServiceMock = (): ILocalStorageService => {
    const storage = <Record<string, string>>{};

    return <ILocalStorageService>{
        set: function(key, data) {
            storage[key] = data;
        },
        get: function(key) {
            return storage[key];
        },
        remove: function(key) {
            delete storage[key];
        },
        getKeys: function() {
            return Object.keys(storage);
        }
    };
}

export const compareId = (id: string, func: string | Function): boolean=> {
    const name = (func as Function).name || func as string;
    return id.toLowerCase() === name.toLowerCase();
}