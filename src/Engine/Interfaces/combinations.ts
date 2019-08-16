namespace StoryScript {
    /**
     * A list of combinations that can be used on an object.
     */
    export interface ICombinations<T extends ICombinable> {
        /**
         * The combinations available.
         */
        combine: ICombine<T>[];

        /**
         * The text to show to the player, or a function returning this text, when a combination attempt on this object fails.
         * @param game The game object
         * @param target The target of the combination.
         * @param tool The tool for the combination.
         */
        failText?: string | ((game: IGame, target: ICombinable, tool: ICombinable) => string);
    }

    /**
     * A combination definition.
     */
    export interface ICombine<T extends ICombinable> {
        /**
         * The tool for this combination.
         */
        tool?: T;

        /**
         * The type of the combination, which should match an ICombination text.
         */
        combinationType: string,

        /**
         * The function to execute when a combination is successful. Return the success text.
         * @param game The game object
         * @param target The target of the combination
         * @param tool The tool for the combination
         */
        match(game: IGame, target: ICombinable, tool: ICombinable): string | IMatchResult;
    }

    export interface ICombineResult {
        /**
         * The result text of the combination attempt.
         */
        text: string;

        /**
         * True if a successful match was made, false otherwise.
         */
        success: boolean;

        /**
         * If true, remove the feature after the match is made.
         */
        removeFeature?: boolean
    }

    export interface IMatchResult {
        /**
         * The result text of the combination match.
         */
        text: string,

        /**
         * If true, remove the feature after the match is made.
         */
        removeFeature?: boolean
    }
}