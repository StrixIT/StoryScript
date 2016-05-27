module StoryScript.Interfaces {
    export interface IAction {
        text?: string;
        type?: string,
        active?: (...params) => boolean;
        execute: (...params) => void;
    }
}