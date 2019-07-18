namespace StoryScript {
    /**
     * Defines the base properties for an enemy in the game.
     */
    export interface IEnemy extends IFeature {
        /**
         * The details about this enemy as displayed to the player. If you use an HTML-page to describe the enemy, the contents of that HTML-page
         * will be used to set this property at run-time.
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
         * The items the enemy is carrying.
         */
        items?: ICollection<IItem>;

        /**
         * When this flag is set to true, the enemy is not shown to the player, cannot be attacked and will not block the player from travelling.
         * Useful to only conditionally make enemies present on a location.
         */
        inactive?: boolean;

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