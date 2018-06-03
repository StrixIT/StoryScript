namespace StoryScript {
    /**
     * A location compiled for runtime.
     */
    export interface ICompiledLocation {
        /**
         * The id of the location.
         */
        id: string;

        /**
         * The name of the location as shown to the player.
         */
        name: string;

        /**
         * When specified, this function is called to determine the selector for the description of this location. Useful for dynamically
         * setting a location's description. If you want to have a description selector function for all locations, use the descriptionSelector
         * function of the game rules. Return the selector string.
         */
        descriptionSelector?: (game: IGame) => string;

        /**
         * The features of this location that the player can interact with.
         */
        features?: IFeature[];

        /**
         * The enemies that can be present at this location.
         */
        enemies?: ICompiledCollection<IEnemy, ICompiledEnemy>;

        /**
         * The enemies that are present (active) at this location.
         */
        activeEnemies?: ICompiledCollection<IEnemy, ICompiledEnemy>;

        /**
         * The characters that can be present at this location that the player can interact with.
         */
        persons?: ICompiledCollection<IPerson, ICompiledPerson>;

        /**
         * The characters that are present (active) at this location that the player can interact with.
         */
        activePersons?: ICompiledCollection<IPerson, ICompiledPerson>;

        /**
         * The items that can be found at this location.
         */
        items?: ICollection<IItem>;

        /**
         * The items that are found (active) at this location.
         */
        activeItems?: ICollection<IItem>;

        /**
         * The other locations in the game world that can be reachable from this one.
         */
        destinations?: ICollection<IDestination>;

        /**
         * The other locations in the game world that are reachable (active) from this one.
         */
        activeDestinations?: ICollection<IDestination>;

         /**
         * When specified, the functions in this array will be called when the player enters the location for the first time.
         */       
        enterEvents?: [(game: IGame) => void];

        /**
         * When specified, the functions in this array will be called when the player leaves the location.
         */
        leaveEvents?: [(game: IGame) => void];

        /**
         * Actions that the player can perform at this location.
         */        
        actions?: ICollection<IAction>;

        /**
         * Actions that the player can perform at this location when in combat.
         */        
        combatActions?: ICollection<IAction>;

        /**
         * The current description shown to the player for this location.
         */
        text: string;

        /**
         * True if the player has visited this location, false otherwise.
         */
        hasVisited: boolean;

        /**
         * All the descriptions available for this location, per description key.
         */
        descriptions: { [key: string] : string; };

         /**
         * Trade objects present at this location. If you don't want to use persons to trade with, you can use this object. Useful for
         * e.g. adding containers like closets to the game.
         */       
        trade?: ITrade;

        /**
         * The person the player is currently talking to.
         */
        activePerson?: ICompiledPerson;

         /**
         * The trade object or person the player is currently trading with.
         */
        activeTrade?: ITrade;

        /**
         * Messages logged to this location.
         */
        log: string[];

        /**
         * When specified, this function will be called on leaving a location to determine whether the player has done all
         * there is to do on this location.
         */
        // Todo: keep this on the general code or is this game specific?
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}