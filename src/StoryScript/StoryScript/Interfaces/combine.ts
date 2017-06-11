module StoryScript {
    export interface ICombinations<T> {
        combine: ICombine<T>[];
        combineFailText?: (game: IGame, target: T) => string;
    }

    export interface ICombine<T> {
        target: T;
        type: string,
        match: (game: IGame, self: { combinations: ICombinations<T> }, target: T) => void;
    }
}