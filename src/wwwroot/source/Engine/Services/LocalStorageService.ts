namespace StoryScript 
{
    const STORYSCRIPTKEY: string = 'StoryScript';

    export interface ILocalStorageService {
        get(key: string): any;
        getKeys(): string[];
        set(key: string, value: any): void;
    }

    export class LocalStorageService implements ILocalStorageService {
        get = (key: string): any => {
            return localStorage.getItem(STORYSCRIPTKEY + '_' + key);
        }

        getKeys = (): string[] => {
            var result = [];

            for (var key in localStorage) {
                if (localStorage.hasOwnProperty(key))
                result.push(key);
             }

            return result;
        }

        set = (key: string, value: any): void => {
            localStorage.setItem(STORYSCRIPTKEY + '_' + key, value);
        }
    }
}