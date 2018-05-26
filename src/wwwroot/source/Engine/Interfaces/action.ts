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
        type?: ActionType;

         /**
         * The action status or a function that returns an action status to set the status dynamically.
         */
        status?: ActionStatus | ((game: IGame, ...params) => ActionStatus);

         /**
         * The function to execute when the player selects the action.
         */
        execute: ((game: IGame, actionIndex: number, ...params) => void) | string;

        /**
         * Additional parameters to pass to the execute function.
         */
        arguments?: any[];
    }
}