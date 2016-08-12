module StoryScript {
    export interface ICollection<T> extends Array<T> {
        all?(id: string | ((...params) => T) | T): T[];
        get?(id?: string | ((...params) => T) | T): T;
        remove?(id: string | ((...params) => T) | T): void;
    }
}