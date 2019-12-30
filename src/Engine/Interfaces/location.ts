import { ICollection } from './collection';
import { IGame } from './game';
import { IAction } from './action';
import { IFeatureCollection } from './featureCollection';
import { IEnemy } from './enemy';
import { IPerson } from './person';
import { IItem } from './item';
import { IDestination } from './destination';
import { ITrade } from './trade';

/**
 * The base properties for a part of the game world. A StoryScript game world is made up of a collection of locations.
 */
export interface ILocation {
    /**
     * The name of the location as shown to the player.
     */
    name: string;

    /**
     * The location description html file.
     */
    description: string;

    /**
     * When specified, the functions in this array will be called when the player enters the location.
     * If nothing or false is returned, the function will be removed once it completed. Return true
     * to keep the function and call it every time the player enters the location.
     */
    enterEvents?: ICollection<((game: IGame) => void | boolean)>;

    /**
     * When specified, the functions in this array will be called when the player leaves the location.
     * If nothing or false is returned, the function will be removed once it completed. Return true
     * to keep the function and call it every time the player leaves the location.
     */
    leaveEvents?: ICollection<((game: IGame) => void | boolean)>;

    /**
     * Actions that the player can perform at this location.
     */
    actions?: ICollection<IAction>;

    /**
     * Actions that the player can perform at this location when in combat.
     */
    combatActions?: ICollection<IAction>;

    /**
     * When specified, this function is called to determine the selector for the description of this location. Useful for dynamically
     * setting a location's description. If you want to have a description selector function for all locations, use the descriptionSelector
     * function of the game rules. Return the selector string.
     * @param game The game object
     */
    descriptionSelector?: ((game: IGame) => string) | string;

    /**
     * The features of this location that the player can interact with.
     */
    features?: IFeatureCollection;

    /**
     * The enemies that occupy this location.
     */
    enemies?: ICollection<IEnemy>;

    /**
     * The characters at this location that the player can interact with.
     */
    persons?: ICollection<IPerson>;

    /**
     * The items that can be found at this location.
     */
    items?: ICollection<IItem>;

    /**
     * The other locations in the game world that can be reached from this one.
     */
    destinations?: ICollection<IDestination>;

    /**
     * Trade objects present at this location. If you don't want to use persons to trade with, you can use this array.
     * Useful for e.g. adding containers like chests to the game.
     */
    trade?: ITrade[];
}