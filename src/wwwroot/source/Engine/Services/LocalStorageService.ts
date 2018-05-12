namespace StoryScript 
{
    const STORYSCRIPTKEY: string = 'StoryScript';

    export interface ILocalStorageService {
        get(key: string): any;
        set(key: string, value: any): void;
    }

    export class LocalStorageService implements ILocalStorageService {
        get = (key: string): any => {
            return localStorage.getItem(STORYSCRIPTKEY + '_' + key);
        }

        set = (key: string, value: any): void => {
            localStorage.setItem(STORYSCRIPTKEY + '_' + key, value);
        }
    }
}