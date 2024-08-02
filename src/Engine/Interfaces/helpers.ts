import { ICollection } from './collection';
import { IItem } from './item';
import { IEnemy } from './enemy';

export interface IHelpers {
    /**
     * Roll a number of dice to get a number.
     * @param compositeOrSides The number and type of dice (e.g. 3d6) or the number of sides of the dice (e.g.) 6
     * @param dieNumber The number of dice, if not using the composite option
     * @param bonus The bonus to add to the result.
     */
    rollDice(compositeOrSides: string | number, dieNumber?: number, bonus?: number): number;

    /**
     * Calculate the bonus the character is granted by the items he is carrying.
     * @param person The player character or the person to calculate the bonus for.
     * @param type The player attribute to get the bonus for (e.g. attack)
     */
    calculateBonus(person: { items?: ICollection<IItem>, equipment?: {} }, type: string): number;

    /**
     * Get a random enemy to add to the game.
     * @param selector A selector function to limit the list of enemies that can be returned at random (for example a function that excludes ghosts)
     */
    randomEnemy(selector?: (enemy: IEnemy) => boolean): IEnemy;

    /**
     * Get a random item to add to the game.
     * @param selector A selector function to limit the list of items that can be returned at random (for example a function that excludes magic items)
     */
    randomItem(selector?: (item: IItem) => boolean): IItem;

    /**
     * Gets a specific item to add to the game.
     * @param selector The id of the item to add
     */        
    getItem(selector: string): IItem;

    /**
     * Gets a specific enemy to add to the game.
     * @param selector The id of the enemy to add
     */        
    getEnemy(selector: string): IEnemy;
}