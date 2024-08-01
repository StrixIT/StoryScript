import {ILocalStorageService} from '../Interfaces/services/localStorageService';

const StoryScriptKey: string = 'StoryScript';

export class LocalStorageService implements ILocalStorageService {
    get = (key: string): any => localStorage.getItem(StoryScriptKey + '_' + key);

    set = (key: string, value: any): void => localStorage.setItem(StoryScriptKey + '_' + key, value);

    remove = (key: string): void => localStorage.removeItem(StoryScriptKey + '_' + key);

    getKeys = (prefix: string): string[] => {
        const result = [];
        prefix = StoryScriptKey + '_' + prefix;

        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith(prefix)) {
                result.push(key.replace(prefix, ''));
            }
        }

        return result;
    }
}