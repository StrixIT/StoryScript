module StoryScript {
    export interface IBarrierAction {
        text: string;
        action: (...params) => void;
    }
}