namespace StoryScript {
    export interface ILocation {
        name: string;
        descriptionSelector?: (game: IGame) => string;
        features?: IFeature[];
        enemies?: ICollection<() => IEnemy>;
        persons?: ICollection<() => IPerson>;
        items?: ICollection<() => IItem>;
        destinations?: ICollection<IDestination>;
        enterEvents?: [(game: IGame) => void];
        leaveEvents?: [(game: IGame) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        trade?: ITrade;
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}