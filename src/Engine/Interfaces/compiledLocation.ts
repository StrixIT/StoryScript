import {ILocation} from './location';
import {IEnemy} from './enemy';
import {IPerson} from './person';
import {IItem} from './item';
import {IDestination} from './destination';
import {IAction} from './storyScript';

/**
 * A location compiled for runtime.
 */
export interface ICompiledLocation extends ILocation {
    /**
     * The id of the location.
     */
    id: string;

    /**
     * The enemies that are present (active) at this location.
     */
    activeEnemies?: IEnemy[];

    /**
     * The characters that are present (active) at this location that the player can interact with.
     */
    activePersons?: IPerson[];

    /**
     * The items that are found (active) at this location.
     */
    activeItems?: IItem[];

    /**
     * The other locations in the game world that are reachable (active) from this one.
     */
    activeDestinations?: IDestination[];

    /**
     * The actions the player can choose from (active) at this location.
     */
    activeActions?: [string, IAction][];

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
     * Messages logged to this location.
     */
    log?: string[];
}