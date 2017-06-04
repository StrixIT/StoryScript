module StoryScript {
    export interface ICombine {
        target: any;
        type: string,
        combine: (game: IGame) => void;
    }

    export interface ICombination {
        source: { name };
        target: { name };
        type: string;
    }
}