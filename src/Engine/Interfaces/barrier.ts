namespace StoryScript {
    /**
     * The base properties for barriers that block a player from moving between one world location to the next.
     */
    export interface IBarrier extends ICombinable {
        /**
         * The actions the player can perform on the barrier (e.g. inspect or open).
         */
        actions?: IBarrierAction[];

        /**
         * The currently selected action for the barrier. Used during run-time only.
         */
        selectedAction?: IBarrierAction;

        /**
         * The key to use to remove this barrier.
         */
        key?: (() => IKey) | string;
    }

    /**
     * Actions that can be performed on barriers, like opening doors or rowing across rivers.
     */
    export interface IBarrierAction {
        /**
         * The name of the barrier action as show to the player.
         */
        text: string;

        /**
         * The function to execute when the player selects this action.
         * @param game The game object
         * @param barrier The barrier
         * @param destination The destination the barrier is for
         */
        execute(game: IGame, barrier: IBarrier, destination: IDestination): void;
    }
}