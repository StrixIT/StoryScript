import {IGame} from "storyScript/Interfaces/game.ts";
import {IActiveCombination} from "storyScript/Interfaces/combinations/activeCombination.ts";

export interface ICombinationRules {
    /**
     * Use this function to run code after each successful combination.
     * @param game The game object
     * @param combination The combination used
     */
    success?: (game: IGame, combination: IActiveCombination) => void;
}