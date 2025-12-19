import { ILocalStorageService } from "../../Engine/Interfaces/services/localStorageService";

export function getStorageServiceMock() {
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

export function compareId(id, func) {
    const name = func.name || func;
    return id.toLowerCase() === name.toLowerCase();
}