import {IBarrier, IDestination, IGame, makeSerializeSafe} from 'storyScript';

/**
 * A basic function to remove a barrier and then execute a callback function.
 * @param callback
 */
export function Open(callback?: (game: IGame, barrier: [string, IBarrier], destination: IDestination) => Promise<void> | void) {
    return makeSerializeSafe(async (game: IGame, barrier: [string, IBarrier], destination: IDestination): Promise<void> => {
        destination.barriers.delete(barrier);
        await callback?.(game, barrier, destination);
    }, callback);
}