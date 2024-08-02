import {ILocalStorageService} from '../Interfaces/services/localStorageService';

const StoryScriptPrefix: string = 'StoryScript_';

export class LocalStorageService implements ILocalStorageService {
    get = (key: string): any => localStorage.getItem(StoryScriptPrefix + key);

    set = (key: string, value: any): void => localStorage.setItem(StoryScriptPrefix + key, value);

    remove = (key: string): void => localStorage.removeItem(StoryScriptPrefix + key);

    getKeys = (): string[] => {
        const result = [];

        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith(StoryScriptPrefix)) {
                result.push(key.replace(StoryScriptPrefix, ''));
            }
        }

        return result;
    }
}