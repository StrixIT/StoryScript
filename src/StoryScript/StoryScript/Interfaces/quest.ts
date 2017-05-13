module StoryScript {
    export interface IQuest {
        name: string;
        issuedBy?: string;
        status: string | ((game: IGame, quest: IQuest, done: boolean) => string),
        start?: ((game: IGame, quest: IQuest, person: ICompiledPerson) => void);
        checkDone: ((game: IGame, quest: IQuest) => boolean);
        complete?: ((game: IGame, quest: IQuest, person: ICompiledPerson) => void);
        completed?: boolean;
        progress?: any
    }
}