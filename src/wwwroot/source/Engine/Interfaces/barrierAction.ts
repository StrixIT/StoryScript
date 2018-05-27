namespace StoryScript {
    /**
     * Actions that can be performed on barriers, like opening doors or rowing across rivers.
     */
    export interface IBarrierAction {
        /**
         * The name of the barrier action as show to the player.
         */
        name: string;

        /**
         * The function to execute when the player selects this action.
         */
        // Todo: should the params collection be this generic or should it be more specific, e.g. just passing in the barrier
        // the action is for? Right now only the game, the destination the action is for, the barrier and the action itself are passed in.
        action: (game: IGame, ...params) => void;
    }
}