namespace StoryScript {
    /**
     * A feature of a location, which can be anything the player can interact with using combinations.
     */
    export interface IFeature {
        /**
         * The name of the feature as shown to the player.
         */
        name: string;

        /**
         * The combinations available for this feature.
         */
        combinations: ICombinations<() => IItem | IFeature>;
    }
}