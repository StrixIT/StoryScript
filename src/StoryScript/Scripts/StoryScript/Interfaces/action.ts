module StoryScript {
    export interface IAction {
        text?: string;
        type?: string,
        active?: (...params) => boolean;
        execute: (...params) => void;
    }
}