namespace StoryScript {
    /**
     * A destination reachable from a location.
     */
    export interface IDestination {
        /**
         * The name of the destination to show to the player.
         */
        name: string;

        /**
         * The location that this destination leads to.
         */
        target: () => ILocation;

        /**
         * A barrier that is blocking travel to the new location.
         */
        barrier?: IBarrier;

        /**
         * The css class to add to the destination so it can be styled.
         */
        style?: string;

        /**
         * True if the barrier is inactive and not visible, false otherwise.
         */
        inactive?: boolean;
    }
}