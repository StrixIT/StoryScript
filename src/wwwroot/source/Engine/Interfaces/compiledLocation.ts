namespace StoryScript {
    /**
     * A location compiled for runtime.
     */
    export interface ICompiledLocation {
        id: string;
        name: string;
        descriptionSelector?: (game: IGame) => string;
        features?: IFeature[];
        enemies?: ICompiledCollection<IEnemy, ICompiledEnemy>;
        activeEnemies?: ICompiledCollection<IEnemy, ICompiledEnemy>;
        persons?: ICompiledCollection<IPerson, ICompiledPerson>;
        activePersons?: ICompiledCollection<IPerson, ICompiledPerson>;
        items?: ICollection<IItem>;
        activeItems?: ICollection<IItem>;
        destinations?: ICollection<IDestination>;
        activeDestinations?: ICollection<IDestination>;
        enterEvents?: [(game: IGame) => void];
        leaveEvents?: [(game: IGame) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        text: string;
        hasVisited: boolean;
        descriptions: { [key: string] : string; };
        trade?: ITrade;
        activePerson?: ICompiledPerson;
        activeTrade?: ITrade;
        log: string[];
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}