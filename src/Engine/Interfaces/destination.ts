namespace StoryScript {
    /**
     * The base properties for a destination reachable from a location.
     */
    export interface IDestinationBase {
        /**
         * The name of the destination to show to the player.
         */
        name: string;

        /**
         * The css class to add to the destination so it can be styled.
         */
        style?: string;

        /**
         * True if the barrier is inactive and not visible, false otherwise.
         */
        inactive?: boolean;
    }

    /**
     * A destination reachable from a location.
     */
    export interface IDestination extends IDestinationBase {
        /**
         * A barrier that is blocking travel to the new location.
         */
        barrier?: IBarrier;

        /**
         * The location that this destination leads to.
         */
        target: () => ILocation;
    }

    /**
     * A destination reachable from a location, compiled for run-time.
     */
    export interface ICompiledDestination extends IDestinationBase {
        /**
         * A barrier that is blocking travel to the new location.
         */
        barrier?: ICompiledBarrier;

         /**
         * The id of the location that this destination leads to.
         */
        target: string;
    }
}