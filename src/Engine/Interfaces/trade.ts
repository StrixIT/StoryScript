namespace StoryScript {
    /**
     * The base properties to configure a trader of or a container for items in the game.
     */
    export interface ITrade {
        /**
         * The title as shown to the player in the trade dialog.
         */
        title?: string;

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
}