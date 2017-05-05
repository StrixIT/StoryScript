module StoryScript {
    export interface IQuest {
        name: string;
        status: {
            [name: string]: {
                description: string | ((game: IGame) => string),
                action?: (game: IGame) => void,
                active?: boolean
            }
        };
        complete?: boolean;
    }
}