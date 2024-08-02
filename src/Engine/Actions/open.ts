import { IGame } from '../Interfaces/game';
import { IBarrier } from '../Interfaces/barrier';
import { IDestination } from '../Interfaces/destination';
import { makeSerializeSafe } from '../globalFunctions';

/**
 * A basic function to remove a barrier and then execute a callback function.
 * @param callback 
 */
export function Open(callback?: (game: IGame, barrier: IBarrier, destination: IDestination) => void) {
    return makeSerializeSafe((game: IGame, barrier: IBarrier, destination: IDestination): void => {
        delete destination.barrier;

        if (typeof callback !== 'undefined' && callback) {
            callback(game, barrier, destination);
        }
    }, { 'callback': callback });
}