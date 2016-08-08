module StoryScript {
    export interface ICompiledLocation {
        id?: string;
        name: string;
        fileLocation?: string;
        enemies?: ICollection<IEnemy>;
        items?: ICollection<IItem>;
        destinations?: ICollection<IDestination>;
        events?: [(game: IGame) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        descriptionSelector?: (game: IGame) => string;
        text: string;
        hasVisited: boolean;
        descriptions: any;
        log: string[];
    }
}