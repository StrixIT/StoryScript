export interface IDataService {
    save<T>(key: string, value: T, pristineValues?: T): void;
    load<T>(key: string): T;
    remove(key: string): void;
    getSaveKeys(): string[];
    copy<T>(value: T, pristineValue: T): T;
}