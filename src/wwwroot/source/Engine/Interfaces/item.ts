namespace StoryScript {
    export interface IItem {
        id?: string;
        name: string;

        /**
         * The file name of the image to display for the item. The file name should be relative to the index.html file. Note that if you
         * use an HTML-page to describe the item, you can add an image-tag to it with the class 'picture'. The source of the image-tag
         * will then be used to set this property at run-time.
         */
        pictureFileName?: string;
        equipmentType: EquipmentType | EquipmentType[];

        /**
         * The details about this item as displayed to the player. If you use an HTML-page to describe the item, the contents of that HTM-page
         * will be used to set this property at run-time.
         */
        description?: string;
        damage?: string;
        defense?: number;
        charges?: number;
        bonuses?: any;
        actions?: ICollection<IAction>;

        /**
         * When this flag is set to true and the item has a use function specified, the use action will also be available during combat.
         */
        useInCombat?: boolean;

        /**
         * The value of the item in whatever credits are used in the game.
         */
        value?: number;

        /**
         * When this flag is set to true, the item is not shown to the player. Useful to only conditionally make items available on a location.
         */
        inactive?: boolean;

        /**
         * When specified, this function will be executed when the item is equipped by the player.
         */
        equip?: (item: IItem, game: IGame) => boolean;

        /**
         * When specified, this function will be executed when the item is unequipped by the player.
         */
        unequip?: (item: IItem, game: IGame) => boolean;

        /**
         * When specified, this item can be used and a use action becomes available on the item. The function will be executed when the player
         * executes this action.
         */
        use?: (game: IGame, item: IItem) => void
    }
}