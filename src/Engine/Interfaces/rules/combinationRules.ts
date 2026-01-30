import {IGame} from "storyScript/Interfaces/game.ts";
import {IActiveCombination} from "storyScript/Interfaces/combinations/activeCombination.ts";

export interface ICombinationRules {
    success?: (game: IGame, combination: IActiveCombination) => void;
}