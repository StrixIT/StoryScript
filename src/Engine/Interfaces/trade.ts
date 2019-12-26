import { IItem } from './item';
import { IStock } from './stock';
import { IGame } from './game';

/**
 * The base properties to configure a trader of or a container for items in the game.
 */
export interface ITrade {
    /**
     * The id of the trade, set at runtime.
     */
    id?: string;

    /**
     * The title as shown to the player in the trade dialog. If the trade is defined
     * for a person, omitting the name will have StoryScript use the person name for
     * the trade.
     */
    name?: string;

    /**
     * The description of the trade as shown to the player.
     */
    description?: string;

    /**
     * The amount of credits the trader has in whatever credits are used in the game. When the trader is a person,
     * the person's currency property will be used to set this value.
     */
    currency?: number;

    /**
     * True if the items for sale by a person are selected from the items the person is carrying, false if other
     * items in the game are also included in the collection the items are to be selected from. The selection of
     * items is done using the initCollection function.
     */
    ownItemsOnly?: boolean;

    /**
     * This function determines whether the list of items available for buying and selling should be refreshed using the itemSelector of the buy property.
     * Return true to refresh the lists, false to keep them as they were.
     * @param game The game object
     * @param trade The trader for which to refresh the item lists
     */
    initCollection?(game: IGame, trade: ITrade): boolean;

    /**
     * This function is executed when the player has bought an item from the trader.
     * @param game The game object
     * @param item The item bought
     */
    onBuy?(game: IGame, item: IItem): void;

    /**
     * This function is executed when the player has sold an item to the trader.
     * @param game The game object
     * @param item The item sold
     */
    onSell?(game: IGame, item: IItem): void;

    /**
     * The collection of items the trader will buy or that can be put in the store.
     */
    sell?: IStock;

    /**
     * The collection of items the trader has to offer or that can be taken from the store.
     */
    buy?: IStock;
}