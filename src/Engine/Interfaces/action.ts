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
        status?: ActionStatus | ((game: IGame, ...params) => ActionStatus);

         /**
         * The function to execute when the player selects the action.
         */
        // Todo: it seems only the game parameter is used right now. Do we need the other arguments?
        execute: string | ((game: IGame, actionIndex: number, ...params) => void);

        /**
         * Additional parameters to pass to the execute function.
         */
        // Todo: will this ever be used? Do we need this? Can this be used to make runtime functions more flexible (issue #93)
        arguments?: any[];
    }
}