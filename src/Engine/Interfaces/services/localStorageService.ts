export interface ILocalStorageService {
    get(key: string): any;
    set(key: string, value: any): void;
    remove(key: string): void;
    getKeys(prefix: string): string[];
}