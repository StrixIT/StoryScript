namespace StoryScript {
    export interface IEnemy {
        /**
         * The file name of the image to display for the enemy. The file name should be relative to the index.html file. Note that if you
         * use an HTML-page to describe the enemy, you can add an image-tag to it with the class 'picture'. The source of the image-tag
         * will then be used to set this property at run-time.
         */
        pictureFileName?: string;

        /**
         * The name of the enemy as displayed to the player.
         */
        name: string;

        /**
         * The details about this enemy as displayed to the player.
         */
        description?: string;

        /**
         * The health of the enemy.
         */
        hitpoints: number;

        /**
         * The amount of credits the enemy has, in whatever form.
         */
        currency?: number;

        /**
         * When this flag is set to true, the enemy is not shown to the player, cannot be attacked and will not block the player from travelling.
         */
        inactive?: boolean;

        /**
         * The items the enemy is carrying.
         */
        items?: ICollection<() => IItem>;

        /**
         * The combinations this enemy can participate in.
         */
        combinations?: ICombinations<() => IItem | IFeature>;

        /**
         * When specified, this function will be called when the enemy is attacked by the player.
         */
        onAttack?: (game: IGame) => void;

        /**
         * When specified, this function will be called when the enemy's health is reduced to 0 or less.
         */
        onDefeat?: (game: IGame) => void;
    }
}