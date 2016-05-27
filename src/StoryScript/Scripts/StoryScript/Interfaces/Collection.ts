module StoryScript.Interfaces {
    export interface ICollection<T> extends Array<T> {
        all?(id: any): T[];
        first?(id?: any): T;
        remove?(id: any): void;
    }
}