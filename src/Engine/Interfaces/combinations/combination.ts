import { ICombinable, ICombine } from './combinations';
import { IGame } from '../game';

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