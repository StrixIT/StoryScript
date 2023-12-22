﻿import { IGame } from '../Interfaces/game';
import { IBarrier } from '../Interfaces/barrier';
import { IDestination } from '../Interfaces/destination';
import { IKey } from '../Interfaces/key';

/**
 * A basic function to remove a barrier using a key and then execute a callback function. When it is not specified that the player
 * should keep the key after using it, it is removed from his item list.
 * @param callBack 
 */
export function OpenWithKey(callBack?: (game: IGame, barrier: IBarrier, destination: IDestination) => void) {
    return (game: IGame, barrier: IBarrier, destination: IDestination) => {
        var key = typeof barrier.key === 'function' ? barrier.key() : <IKey>game.helpers.getItem(barrier.key);

        if (key.keepAfterUse === undefined || key.keepAfterUse !== true) {
            game.character.items.delete(barrier.key);
            game.currentLocation.items.delete(barrier.key);
        }

        delete destination.barrier;

        if (callBack) {
            callBack(game, barrier, destination);
        }
    }
}