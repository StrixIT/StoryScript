module StoryScript {
    export interface ILocation {
        name: string;
        descriptionSelector?: (game: IGame) => string;
        enemies?: ICollection<() => IEnemy>;
        persons?: ICollection<() => IPerson>;
        items?: ICollection<() => IItem>;
        destinations?: ICollection<IDestination>;
        events?: ICollection<(game: IGame) => void>;
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        trade?: ITrade;
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}