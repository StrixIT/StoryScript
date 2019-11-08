import { ICombinationAction, ICombinable } from './combinations';

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
}