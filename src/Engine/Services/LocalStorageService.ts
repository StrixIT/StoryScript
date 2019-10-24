namespace StoryScript 
{
    const STORYSCRIPTKEY: string = 'StoryScript';

    export interface ILocalStorageService {
        get(key: string): any;
        getKeys(prefix: string): string[];
        set(key: string, value: any): void;
    }

    export class LocalStorageService implements ILocalStorageService {
        get = (key: string): any => localStorage.getItem(STORYSCRIPTKEY + '_' + key);

        set = (key: string, value: any): void => localStorage.setItem(STORYSCRIPTKEY + '_' + key, value);

        getKeys = (prefix: string): string[] => {
            var result = [];
            prefix = STORYSCRIPTKEY + '_' + prefix;

            for (var key in localStorage) {
                if (localStorage.hasOwnProperty(key) && key.startsWith(prefix)) {
                    result.push(key.replace(prefix, ''));
                }
             }

            return result;
        }
    }
}