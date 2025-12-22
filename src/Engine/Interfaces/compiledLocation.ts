import {ILocation} from './location';

/**
 * A location compiled for runtime.
 */
export interface ICompiledLocation extends ILocation {
    /**
     * The id of the location.
     */
    id: string;

    /**
     * The current description shown to the player for this location.
     */
    description: string;

    /**
     * True if the player has visited this location, false otherwise.
     */
    hasVisited?: boolean;

    /**
     * All the descriptions available for this location, per description key.
     */
    descriptions?: { [key: string]: string; };

    /**
     * The file path for the picture to show for this location. It is read from the location's HTML file's
     * picture tag if present.
     */
    picture?: string;

    /**
     * Messages logged to this location.
     */
    log?: string[];
}