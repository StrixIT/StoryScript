module StoryScript {
    export interface ICombine<T> {
        target: T;
        type: string,
        combine: (game: IGame) => void;
    }

    export interface ICombination {
        source: any;
        target: any;
        type: string;
    }
}