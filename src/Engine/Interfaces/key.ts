namespace StoryScript {
    /**
     * A special kind of item, that can remove a barrier.
     */
    export interface IKey extends IItem {
        /**
         * Set this flag to true if the player keeps the key after using it. Otherwise, it will be removed from his
         * inventory when used.
         */
        keepAfterUse?: boolean;

        /**
         * The action triggered when using the key to remove the barrier.
         */
        open: IBarrierAction;
    }

    export interface ICompiledKey extends IKey, ICompiledItem {
        
    }
}