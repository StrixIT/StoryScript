module StoryScript {
    export interface IBarrierAction {
        name: string;
        action: (game: IGame, ...params) => void;
    }
}