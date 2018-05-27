namespace StoryScript {
    export interface ILocation {
        /**
         * The name of the location as shown to the player.
         */
        name: string;

        /**
         * When specified, this function is called to determine the selector for the description. Useful for dynamically
         * setting a location's description.
         */
        descriptionSelector?: (game: IGame) => string;
        features?: IFeature[];
        enemies?: ICollection<() => IEnemy>;
        persons?: ICollection<() => IPerson>;
        items?: ICollection<() => IItem>;
        destinations?: ICollection<IDestination>;

        /**
         * When specified, the functions in this array will be called when the player enters the location for the first time.
         */
        enterEvents?: [(game: IGame) => void];

        /**
         * When specified, the functions in this array will be called when the player leaves the location.
         */
        // Todo: shouldn't they be called only one time, when the player first leaves the location?
        leaveEvents?: [(game: IGame) => void];
        actions?: ICollection<IAction>;
        combatActions?: ICollection<IAction>;
        trade?: ITrade;

        /**
         * When specified, this function will be called on leaving a location to determine whether the player has done all
         * there is to do on this location.
         */
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}