module StoryScript {
    export interface IAction {
        text?: string;
        active?: (game: IGame, ...params) => boolean;
        execute: (game: IGame, ...params) => void;
    }
}