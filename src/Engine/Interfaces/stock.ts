import { ICollection } from './collection';
import { IItem } from './item';
import { IGame } from './game';

/**
 * The base properties to configure a collection of items available to buy or sell.
 */
export interface IStock {
    /**
     * The text for buying or selling the items as shown to the player.
     */
    description?: string;

    /**
     * The text to show to the player when there are no items available for buying or selling.
     */
    emptyText?: string;

    /**
     * A number or a function to generate a number dynamically that is used to modify the price of items to buy or sell.
     * This can be used to e.g. give players a discount when they completed quests for the trader.
     */
    priceModifier?: number | ((game: IGame) => number);

    /**
     * This function can be used to limit the items selected from the list of items available for the trader or the items
     * the player has that are available for trading. Return true if the item should be included in the list, false otherwise.
     * @param game The game object
     * @param item The item considered for selection.
     */
    itemSelector?(game: IGame, item: IItem): boolean;

    /**
     * The maximum number of items to select for buying or selling using the item selector.
     */
    maxItems?: number;

    /**
     * The items available for buying or selling.
     */
    items?: ICollection<IItem>;
}