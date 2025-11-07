import { IBarrier } from './barrier';
import { ILocation } from './location';

/**
 * The base properties for a destination reachable from a location.
 */
export interface IDestination {
    /**
     * The name of the destination to show to the player.
     */
    name: string;

    /**
     * The css class to add to the destination so it can be styled.
     */
    style?: string;

    /**
     * True if the destination is inactive and not visible, false otherwise.
     */
    inactive?: boolean;

    /**
     * The barriers that are blocking travel to the new location.
     */
    barriers?: [string, IBarrier][];

    /**
     * The location that this destination leads to.
     */
    target: (() => ILocation) | string;

    /**
     * True if the location this destination leads to was visited before by the player, false otherwise.
     */
    visited?: boolean;
}