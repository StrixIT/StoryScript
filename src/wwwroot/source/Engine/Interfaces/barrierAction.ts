namespace StoryScript {
    export interface IBarrierAction {
        /**
         * The name of the barrier action as show to the player.
         */
        name: string;

        /**
         * The function to execute when the player selects this action.
         */
        // Todo: should the params collection be this generic or should it be more specific, e.g. just passing in the barrier
        // the action is for?
        action: (game: IGame, ...params) => void;
    }
}