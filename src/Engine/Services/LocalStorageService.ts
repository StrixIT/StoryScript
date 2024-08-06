import {ILocalStorageService} from '../Interfaces/services/localStorageService';

const StoryScriptPrefix: string = 'StoryScript_';

export class LocalStorageService implements ILocalStorageService {
    get = (key: string): any => localStorage.getItem(StoryScriptPrefix + key);

    set = (key: string, value: any): void => localStorage.setItem(StoryScriptPrefix + key, value);

    remove = (key: string): void => localStorage.removeItem(StoryScriptPrefix + key);

    getKeys = (prefix: string): string[] => {
        const result = [];
        prefix = `${StoryScriptPrefix}${prefix}_`;

        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(prefix)) {
                result.push(k.replace(prefix, ''));
            }
        });

        return result;
    }
}