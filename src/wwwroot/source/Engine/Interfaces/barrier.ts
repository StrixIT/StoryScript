namespace StoryScript {
    export interface IBarrier {
        /**
         * The name of the barrier as shown to the player.
         */
        name: string;

        /**
         * The actions the player can perform on the barrier (e.g. inspect or open).
         */
        actions?: ICollection<IBarrierAction>;

        /**
         * The currently selected action for the barrier. Used during run-time only.
         */
        selectedAction?: IBarrierAction;

        /**
         * The key used to remove this barrier. This is an item implementing the IKey interface.
         */
        key?: () => IKey;

         /**
         * The combinations this barrier can participate in.
         */
        combinations?: ICombinations<() => IItem | IFeature>;
    }
}