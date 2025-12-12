import { IGame } from './game';
import { ActionType } from './enumerations/actionType';
import { ActionStatus } from './enumerations/actionStatus';

/**
 * Actions available to the player when exploring the location.
 */
export interface IAction {
    /**
     * The text shown for this action (e.g. 'Search').
     */
    text?: string;

    /**
     * How to visually identify this action to the player.
     */
    actionType?: ActionType;

    /**
     * The action status or a function that returns an action status to set the status dynamically.
     */
    status?: ActionStatus | ((game: IGame) => ActionStatus);

    /**
     * The function to execute or game event to raise when the player selects the action. Return 
     * true if the action should be allowed to execute more than once. When an event is raised
     * the action is considered to be allowed to execute more than once.
     */
    execute: string | ((game: IGame) => boolean | void);

    /**
     * If the player should confirm executing the action, specify a text to ask for confirmation here.
     * The player will then be asked to confirm before the action is executed, and he'll have the
     * option to cancel.
     */
    confirmationText?: string;

    /**
     * When this flag is set to true, the action is not shown to the player. Useful to only conditionally
     * make actions present on a location.
     */
    inactive?: boolean;
}