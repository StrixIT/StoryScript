namespace StoryScript {
    /**
     * A list of combinations that can be used on an object.
     */
    export interface ICombinations<T extends () => ICombinable> {
        /**
         * The combinations available.
         */
        combine: ICombine<T>[];

        /**
         * The text to show to the player, or a function returning this text, when a combination attempt on this object fails.
         * @param game The game object
         * @param tool The tool for the combination.
         * @param target The target of the combination.
         */
        failText?: string | ((game: IGame, tool: ICombinable, target: ICombinable) => string);
    }

    /**
     * A combination definition.
     */
    export interface ICombine<T extends () => ICombinable> {
        /**
         * The target of this combination.
         */
        target?: T;

        /**
         * The type of the combination, which should match an ICombination text.
         */
        type: string,

        /**
         * The function to execute when a combination is successful. Return the success text.
         * @param game The game object
         * @param tool The tool for the combination
         * @param target The target of the combination
         */
        match(game: IGame, tool: ICombinable, target: ICombinable): string;
    }
}