module StoryScript {
    export interface ICompiledCollection<T extends ICompiledLocation> extends ICollection<T> {
        get?(id?: string | (() => T) | (() => ILocation) | ILocation | T): T;
    }
}