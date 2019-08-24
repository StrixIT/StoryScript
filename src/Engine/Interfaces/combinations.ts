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
     * The currently active combination when playing the game.
     */
    export interface IActiveCombination {
        /**
         * The action type of the currently active combination.
         */
        selectedCombinationAction: ICombinationAction;

        /**
         * The currently selected tool of the combination.
         */
        selectedTool: ICombinable;

        /**
         * The text displayed to the player for the current combine status.
         */
        combineText: string;
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
         * If true, remove the tool feature after the match is made.
         */
        removeTool?: boolean
        
        /**
         * If true, remove the target feature after the match is made.
         */
        removeTarget?: boolean
    }

    export interface IMatchResult {
        /**
         * The result text of the combination match.
         */
        text: string,

        /**
         * If true, remove the tool feature after the match is made.
         */
        removeTool?: boolean
        
        /**
         * If true, remove the target feature after the match is made.
         */
        removeTarget?: boolean
    }
}