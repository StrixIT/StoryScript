module StoryScript.Interfaces {
    export interface IBarrierAction {
        text: string;
        action: (...params) => void;
    }
}