export interface IDataService {
    save<T>(key: string, value: T, pristineValues?: T): void;
    load<T>(key: string): T;
    getSaveKeys(): string[];
    copy<T>(value: T, pristineValue: T): T;
}