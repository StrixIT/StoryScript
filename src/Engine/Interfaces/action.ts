import { IGame } from './game';
import { ActionType } from './enumerations/actionType';
import { ActionStatus } from './enumerations/actionStatus';

/**
 * Actions available to the player when exploring the location.
 */
export interface IAction {
    /**
     * The id of the action, set at runtime.
     */
    id?: string;

    /**
     * The text shown for this action (e.g. 'Search').
     */
    text?: string;

    /**
     * How to visually identify this action to the player.
     */
    actionType?: ActionType;

    /**
     * True if the action is inactive and not visible, false otherwise.
     */
    inactive?: boolean;

    /**
     * The action status or a function that returns an action status to set the status dynamically.
     */
    status?: ActionStatus | ((game: IGame) => ActionStatus);

    /**
     * The function to execute when the player selects the action. Return true if the action should
     * be allowed to execute more than once.
     */
    execute: string | ((game: IGame) => boolean | void);
}