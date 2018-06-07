namespace StoryScript {
    /**
     * A list of combinations that can be used.
     */
    export interface ICombinations<T> {
        /**
         * The combinations available.
         */
        combine: ICombine<T>[];

        /**
         * A function to execute when a combination attempt fails.
         * @param game The game object
         * @param target The target of the combination.
         */
        combineFailText?(game: IGame, target: T): string;
    }

    /**
     * A combination definition.
     */
    export interface ICombine<T> {
        /**
         * The target of this combination.
         */
        target: T;

        /**
         * The type of the combination, which should match a ICombination text.
         */
        type: string,

        /**
         * The function to execute when a combination is successful.
         * @param game The game object
         * @param self The combinations collection
         * @param target The target of the combination
         */
        match(game: IGame, self: { combinations: ICombinations<T> }, target: T): void;
    }
}