import { IGame } from '../Interfaces/game';
import { IBarrier } from '../Interfaces/barrier';
import { IDestination } from '../Interfaces/destination';

/**
 * A basic function to remove a barrier and then execute a callback function.
 * @param callback 
 */
export function Open(callback?: (game: IGame, barrier: IBarrier, destination: IDestination) => void) {
    return (game: IGame, barrier: IBarrier, destination: IDestination): void => {
        delete destination.barrier;

        if (callback) {
            callback(game, barrier, destination);
        }
    }
}