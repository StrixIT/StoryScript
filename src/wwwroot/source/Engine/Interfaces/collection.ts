namespace StoryScript {
    export interface ICollection<T> extends Array<T> {
        get?(id?: string | ((...params) => T) | T): T;
        push(id?: string | (() => T) | T): number;
        remove?(id: string | ((...params) => T) | T): void;
    }
}