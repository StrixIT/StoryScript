import { IGame } from './game';
import { IBarrier } from './barrier';
import { IDestination } from './destination';

/**
 * Actions that can be performed on barriers, like opening doors or rowing across rivers.
 */
export interface IBarrierAction {
    /**
     * The name of the barrier action as show to the player.
     */
    text: string;

    /**
     * The function to execute when the player selects this action.
     * @param game The game object
     * @param barrier The barrier
     * @param destination The destination the barrier is for
     */
    execute(game: IGame, barrier: IBarrier, destination: IDestination): void;
}