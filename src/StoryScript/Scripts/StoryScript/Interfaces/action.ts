module StoryScript {
    export interface IAction {
        text?: string;
        type?: ActionType;
        status?: ActionStatus | ((game: IGame, ...params) => ActionStatus);
        execute: (game: IGame, ...params) => void;
    }
}