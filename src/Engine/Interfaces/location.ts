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
        enterEvents?: ((game: IGame) => void)[];

        /**
         * When specified, the functions in this array will be called when the player leaves the location.
         */
        // Todo: shouldn't they be called only one time, when the player first leaves the location?
        leaveEvents?: ((game: IGame) => void)[];

        /**
         * Actions that the player can perform at this location.
         */
        actions?: IAction[];

        /**
         * Actions that the player can perform at this location when in combat.
         */
        combatActions?: IAction[];

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
        features?: IFeature[];

        /**
         * The enemies that occupy this location.
         */
        enemies?: IEnemy[];

        /**
         * The characters at this location that the player can interact with.
         */
        persons?: IPerson[];

        /**
         * The items that can be found at this location.
         */
        items?: IItem[];

        /**
         * The other locations in the game world that can be reached from this one.
         */
        destinations?: IDestination[];

        /**
         * Trade objects present at this location. If you don't want to use persons to trade with, you can use this object. Useful for
         * e.g. adding containers like closets to the game.
         */
        trade?: ITrade;

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
        activeEnemies?: IEnemy[];

        /**
         * The characters that are present (active) at this location that the player can interact with.
         */
        activePersons?: IPerson[];

        /**
         * The items that are found (active) at this location.
         */
        activeItems?: IItem[];

        /**
         * The other locations in the game world that are reachable (active) from this one.
         */
        activeDestinations?: IDestination[];

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