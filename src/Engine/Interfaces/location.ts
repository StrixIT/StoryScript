namespace StoryScript {
    /**
     * A part of the game world. A StoryScript game world is made up of a collection of locations.
     */
    export interface ILocation {
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
         * The other locations tn the game world that can be reached from this one.
         */
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

        /**
         * Actions that the player can perform at this location.
         */
        actions?: ICollection<IAction>;

        /**
         * Actions that the player can perform at this location when in combat.
         */
        combatActions?: ICollection<IAction>;

        /**
         * Trade objects present at this location. If you don't want to use persons to trade with, you can use this object. Useful for
         * e.g. adding containers like closets to the game.
         */
        trade?: ITrade;

        /**
         * When specified, this function will be called on leaving a location to determine whether the player has done all
         * there is to do on this location.
         */
        // Todo: keep this on the general code or is this game specific?
        complete?: (game: IGame, location: ICompiledLocation) => boolean;
    }
}