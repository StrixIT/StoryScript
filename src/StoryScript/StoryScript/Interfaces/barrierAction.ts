module StoryScript {
    export interface IBarrierAction {
        text: string;
        action: (game: IGame, ...params) => void;
    }
}