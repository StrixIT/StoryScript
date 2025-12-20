import {IGame} from '../Interfaces/game';
import {IBarrier} from '../Interfaces/barrier';
import {IDestination} from '../Interfaces/destination';
import {IKey} from '../Interfaces/key';
import {makeSerializeSafe} from "storyScript/Services/sharedFunctions.ts";

/**
 * A basic function to remove a barrier using a key and then execute a callback function. When it is not specified that the player
 * should keep the key after using it, it is removed from his item list.
 * @param callback The callback function to invoke after the barrier is removed.
 */
export function OpenWithKey(callback?: (game: IGame, barrier: [string, IBarrier], destination: IDestination) => void) {
    return makeSerializeSafe((game: IGame, barrier: [string, IBarrier], destination: IDestination) => {
        const key = typeof barrier[1].key === 'function' ? barrier[1].key() : <IKey>game.helpers.getItem(barrier[1].key);

        if (key.keepAfterUse === undefined || key.keepAfterUse !== true) {
            game.party.characters.forEach(c => {
                c.items.delete(barrier[1].key);
            });

            game.currentLocation.items.delete(barrier[1].key);
        }

        destination.barriers.delete(barrier);

        if (callback !== undefined && callback) {
            callback(game, barrier, destination);
        }
    }, {'callback': callback});
}