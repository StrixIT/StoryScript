module StoryScript {
    export interface IAction {
        text?: string;
        // Todo: is this used?
        type?: string,
        active?: (...params) => boolean;
        execute: (...params) => void;
    }
}