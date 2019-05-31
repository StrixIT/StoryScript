namespace StoryScript {
    /**
     * The base properties for a part of the game world. A StoryScript game world is made up of a collection of locations.
     */
    export interface ILocationBase {
        /**
         * The name of the location as shown to the player.
         */
        name: string;

        /**
         * When specified, the functions in this array will be called when the player enters the location for the first time.
         */
        enterEvents?: ((game: IGame) => void)[];

        /**
         * When specified, the functions in this array will be called when the player leaves the location.
         */
        // Todo: shouldn't they be called only one time, when the player first leaves the location?
        leaveEvents?: ((game: IGame) => void)[];

        /**
         * Actions that the player can perform at this location.
         */
        actions?: ICollection<IAction>;

        /**
         * Actions that the player can perform at this location when in combat.
         */
        combatActions?: ICollection<IAction>;

        /**
         * When specified, this function will be called on leaving a location to determine whether the player has done all
         * there is to do on this location.
         * @param game The game object
         * @param location The location to check for completion
         */
        // Todo: keep this on the general code or is this game specific?
        complete?(game: IGame, location: ICompiledLocation): boolean;
    }

    /**
     * A part of the game world. A StoryScript game world is made up of a collection of locations.
     */
    export interface ILocation extends ILocationBase {
        /**
         * When specified, this function is called to determine the selector for the description of this location. Useful for dynamically
         * setting a location's description. If you want to have a description selector function for all locations, use the descriptionSelector
         * function of the game rules. Return the selector string.
         * @param game The game object
         */
        descriptionSelector?(game: IGame): string;

        /**
         * The features of this location that the player can interact with.
         */
        features?: ICollection<IFeature>;

        /**
         * The enemies that occupy this location.
         */
        enemies?: ICollection<() => IEnemy>;

        /**
         * The characters at this location that the player can interact with.
         */
        persons?: ICollection<() => IPerson>;

        /**
         * The items that can be found at this location.
         */
        items?: ICollection<() => IItem>;

        /**
         * The other locations in the game world that can be reached from this one.
         */
        destinations?: ICollection<IDestination>;

        /**
         * Trade objects present at this location. If you don't want to use persons to trade with, you can use this object. Useful for
         * e.g. adding containers like closets to the game.
         */
        trade?: ITrade;
    }

        /**
     * A location compiled for runtime.
     */
    export interface ICompiledLocation extends ILocationBase {
        /**
         * The id of the location.
         */
        id: string;

        /**
         * You can specify a function to determine a description selector or use a string value. When specified, the selector is used for
         * setting a location's description from a list of available alternatives. If you want to have a description selector function for 
         * all locations, use the descriptionSelector function of the game rules.
         */
        descriptionSelector?: ((game: IGame) => string) | string;

        /**
         * The features of this location that the player can interact with.
         */
        features?: ICollection<ICompiledFeature>;

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
        items?: ICompiledCollection<IItem, ICompiledItem>;

        /**
         * The items that are found (active) at this location.
         */
        activeItems?: ICollection<ICompiledItem>;

        /**
         * The other locations in the game world that can be reachable from this one.
         */
        destinations?: ICompiledCollection<IDestination, ICompiledDestination>;

        /**
         * The other locations in the game world that are reachable (active) from this one.
         */
        activeDestinations?: ICompiledCollection<IDestination, ICompiledDestination>;

        /**
         * The current description shown to the player for this location.
         */
        text?: string;

        /**
         * True if the player has visited this location, false otherwise.
         */
        hasVisited?: boolean;

        /**
         * All the descriptions available for this location, per description key.
         */
        descriptions?: { [key: string] : string; };

        /**
         * The person the player is currently talking to.
         */
        activePerson?: ICompiledPerson;

        /**
         * Trade objects present at this location. If you don't want to use persons to trade with, you can use this object. Useful for
         * e.g. adding containers like closets to the game.
         */
        trade?: ICompiledTrade;

         /**
         * The trade object or person the player is currently trading with.
         */
        activeTrade?: ICompiledTrade;

        /**
         * Messages logged to this location.
         */
        log?: string[];
    }
}