module StoryScript {
    export interface ILocation {
        id?: string;
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
    }
}