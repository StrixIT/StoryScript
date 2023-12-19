import { ICollection } from './collection';
import { ILocation } from './location';
import { IEnemy } from './enemy';
import { IPerson } from './person';
import { IItem } from './item';
import { IDestination } from './destination';
import { IAction } from './storyScript';
import { RuntimeProperties } from 'storyScript/runtimeProperties';

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
    activeEnemies?: ICollection<IEnemy>;

    /**
     * The characters that are present (active) at this location that the player can interact with.
     */
    activePersons?: ICollection<IPerson>;

    /**
     * The items that are found (active) at this location.
     */
    activeItems?: ICollection<IItem>;

    /**
     * The other locations in the game world that are reachable (active) from this one.
     */
    activeDestinations?: ICollection<IDestination>;

    /**
     * The actions the player can choose from (active) at this location.
     */
    activeActions?: ICollection<IAction>;

    /**
     * The current description shown to the player for this location.
     */
    [RuntimeProperties.Description]: string;

    /**
     * True if the player has visited this location, false otherwise.
     */
    [RuntimeProperties.HasVisited]?: boolean;

    /**
     * All the descriptions available for this location, per description key.
     */
    [RuntimeProperties.Descriptions]?: { [key: string] : string; };

    /**
     * Messages logged to this location.
     */
    [RuntimeProperties.Log]?: string[];
}