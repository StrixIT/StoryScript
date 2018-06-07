namespace StoryScript {
    /**
     * An enemy instance compiled for runtime.
     */
    export interface ICompiledEnemy {
        /**
         * The id of the enemy.
         */
        id: string;

        /**
         * The file name of the picture to show for the enemy. It should be relative to the index.html file.
         */
        pictureFileName?: string;

        /**
         * The name of the enemy as displayed to the player.
         */
        name: string;

        /**
         * A description of the enemy as displayed to the player.
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
         * Useful to only conditionally make enemies present on a location.
         */
        inactive?: boolean;

        /**
         * The items the enemy is carrying.
         */
        items?: ICollection<IItem>;

        /**
         * The combinations this enemy can participate in.
         */
        combinations?: ICombinations<IItem | IFeature>;

        /**
         * When specified, this function will be called when the enemy is attacked by the player.
         * @param game The game object
         */
        onAttack?(game: IGame): void;

        /**
         * When specified, this function will be called when the enemy's health is reduced to 0 or less.
         * @param game The game object
         */
        onDefeat?(game: IGame): void;
    }
}