import {IActiveCombination, ICombinable, ICombineResult}from 'storyScript';

export interface IGameCombinations {
    /**
     * Holds the currently selected combination action during rum-time. This will be undefined or null when the player
     * is not trying a combination.
     */
    activeCombination: IActiveCombination,

    /**
     * The result from the last attempted combination.
     */
    combinationResult:
        {
            /**
             * Indicates whether the combination is done.
             */
            done: boolean;

            /**
             * The combination result text.
             */
            text: string;

            /**
             * The features to remove.
             */
            featuresToRemove: string[];

            /**
             * Resets the combination result.
             */
            reset(): void;
        }

    /**
     * Get the class name to use for the current combine state.
     * @param tool The tool of the combination. Pass this in to get the class name for the tool element. Pass nothing to
     * get the class name for the tool button bar.
     */
    getCombineClass(tool: ICombinable): string;

    /**
     * Try the combination the player has created.
     * @param target The target of the combination
     */
    tryCombine(target: ICombinable): ICombineResult;
}