namespace StoryScript {
    /**
     * Used to set the availability of actions to the player.
     */
    export enum ActionStatus {
        /**
         * The action shows up for the player and is selectable.
         */
        Available,

         /**
         * The action shows up for the player but is not selectable.
         */
        Disabled,

         /**
         * The action is not shown to the player. Useful for actions that are only conditionally available.
         */
        Unavailable
    }
}