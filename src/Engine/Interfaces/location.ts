namespace StoryScript {
    /**
     * The base properties for a part of the game world. A StoryScript game world is made up of a collection of locations.
     */
    export interface ILocation {
        /**
         * The name of the location as shown to the player.
         */
        name: string;

        /**
         * When specified, the functions in this array will be called when the player enters the location for the first time.
         */
        enterEvents?: ICollection<((game: IGame) => void)>;

        /**
         * When specified, the functions in this array will be called when the player leaves the location for the first time.
         */
        leaveEvents?: ICollection<((game: IGame) => void)>;

        /**
         * Actions that the player can perform at this location.
         */
        actions?: ICollection<IAction>;

        /**
         * Actions that the player can perform at this location when in combat.
         */
        combatActions?: ICollection<IAction>;

        /**
         * When specified, this function is called to determine the selector for the description of this location. Useful for dynamically
         * setting a location's description. If you want to have a description selector function for all locations, use the descriptionSelector
         * function of the game rules. Return the selector string.
         * @param game The game object
         */
        descriptionSelector?: ((game: IGame) => string) | string;

        /**
         * The features of this location that the player can interact with.
         */
        features?: IFeatureCollection;

        /**
         * The enemies that occupy this location.
         */
        enemies?: ICollection<IEnemy>;

        /**
         * The characters at this location that the player can interact with.
         */
        persons?: ICollection<IPerson>;

        /**
         * The items that can be found at this location.
         */
        items?: ICollection<IItem>;

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
    export interface ICompiledLocation extends ILocation {
        /**
         * The id of the location.
         */
        id: string;

        /**
         * The enemies that are present (active) at this location.
         */
        activeEnemies?: ICollection<IEnemy>;

        /**
         * The characters that are present (active) at this location that the player can interact with.
         */
        activePersons?: ICollection<IPerson>;

        /**
         * The items that are found (active) at this location.
         */
        activeItems?: ICollection<IItem>;

        /**
         * The other locations in the game world that are reachable (active) from this one.
         */
        activeDestinations?: ICollection<IDestination>;

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
        activePerson?: IPerson;

         /**
         * The trade object or person the player is currently trading with.
         */
        activeTrade?: ITrade;

        /**
         * Messages logged to this location.
         */
        log?: string[];
    }
}