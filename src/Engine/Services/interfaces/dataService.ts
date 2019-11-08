export interface IDataService {
    loadDescription(type: string, item: { id?: string, description?: string }): string;
    hasDescription(type: string, item: { id?: string, description?: string }): boolean;
    save<T>(key: string, value: T, pristineValues?: T): void;
    load<T>(key: string): T;
    getSaveKeys(): string[];
    copy<T>(value: T, pristineValue: T): T;
}