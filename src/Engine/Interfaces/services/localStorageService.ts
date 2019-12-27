export interface ILocalStorageService {
    get(key: string): any;
    getKeys(prefix: string): string[];
    set(key: string, value: any): void;
}