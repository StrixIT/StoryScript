import {IGame} from "storyScript/Interfaces/game.ts";
import {IActiveCombination} from "storyScript/Interfaces/combinations/activeCombination.ts";
import {ICombinationAction} from "storyScript/Interfaces/combinations/combinationAction.ts";

export interface ICombinationRules {
    /**
     * If you want to use combinations in your game, you must use this property to specify the 
     * combination actions that your game uses (e.g. 'Look at', 'Use', etc.).
     */
    combinationActions?: ICombinationAction[];
    
    /**
     * Use this setting of you want to work with custom mouse cursors and want to override the default styling.
     * The default is 'url(resources/default.png) 25 25, pointer'. Note that default.png is just a placeholder,
     * it will be replaced by the picture specified on the combination action.
     */
    combinationCursorStyle?: string;
    
    /**
     * Use this function to run code after each successful combination.
     * @param game The game object
     * @param combination The combination used
     */
    success?: (game: IGame, combination: IActiveCombination) => void;
}