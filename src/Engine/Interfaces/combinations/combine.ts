import { IGame } from '../game';
import { ICombinable } from './combinable';
import { ICombinationMatchResult } from './combinationMatchResult';

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
     * The function to execute when a combination is successful. Return the success text. When omitted,
     * the default match for the combination type will be invoked (when specified).
     * @param game The game object
     * @param target The target of the combination
     * @param tool The tool for the combination
     */
    match?(game: IGame, target: ICombinable, tool: ICombinable): string | ICombinationMatchResult;
}