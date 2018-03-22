namespace StoryScript {
    export interface ICompiledCollection<T, U> extends Array<U> {
        get?(id?: string | (() => T)): U;
        push(id?: string | (() => T) | U): number;
        remove?(id: string | ((...params) => U) | U): void;
    }
}