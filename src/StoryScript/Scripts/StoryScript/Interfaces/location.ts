module StoryScript {
    export interface ILocation {
        id?: string;
        name: string;
        descriptionSelector?: string | ((game: IGame) => string);
        enemies?: [() => IEnemy];
        items?: [() => IItem];
        destinations?: ICollection<IDestination>;
        events?: ICollection<(game: IGame) => void>;
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        trade?: ITrade;
    }
}