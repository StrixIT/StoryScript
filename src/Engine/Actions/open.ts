﻿import { IGame } from '../Interfaces/game';
import { IBarrier } from '../Interfaces/barrier';
import { IDestination } from '../Interfaces/destination';
import {makeSerializeSafe} from "storyScript/Services/sharedFunctions.ts";

/**
 * A basic function to remove a barrier and then execute a callback function.
 * @param callback 
 */
export function Open(callback?: (game: IGame, barrier: [string, IBarrier], destination: IDestination) => void) {
    return makeSerializeSafe((game: IGame, barrier: [string, IBarrier], destination: IDestination): void => {
        destination.barriers.delete(barrier);

        if (typeof callback !== 'undefined' && callback) {
            callback(game, barrier, destination);
        }
    }, { 'callback': callback });
}