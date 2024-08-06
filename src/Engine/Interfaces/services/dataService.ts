export interface IDataService {
    save<T>(key: string, value: T): void;
    load<T>(key: string): T;
    remove(key: string): void;
    getSaveKeys(): string[];
}