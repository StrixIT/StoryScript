import {IActiveCombination, ICombinable, ICombinationAction, IGame} from 'storyScript';

export interface ICombinationRules {
    /**
     * If you want to use combinations in your game, you must use this property to specify the
     * combination actions that your game uses (e.g. 'Look at', 'Use', etc.).
     */
    combinationActions?: ICombinationAction[];

    /**
     * Use this function to run code after each successful combination.
     * @param game The game object
     * @param combination The combination used
     * @param target The target of the combination
     */
    success?: (game: IGame, combination: IActiveCombination, target: ICombinable) => void;
}