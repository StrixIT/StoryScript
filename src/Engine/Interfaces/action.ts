namespace StoryScript {
    /**
     * Actions available to the player when exploring the location.
     */
    export interface IAction {
        /**
         * The text shown for this action (e.g. 'Search').
         */
        text?: string;

        /**
         * How to visually identify this action to the player.
         */
        actionType?: ActionType;

         /**
         * The action status or a function that returns an action status to set the status dynamically.
         */
        status?: ActionStatus | ((game: IGame) => ActionStatus);

         /**
         * The function to execute when the player selects the action.
         */
        execute: string | ((game: IGame) => void);
    }
}