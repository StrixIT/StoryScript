namespace StoryScript {
    /**
     * A feature of a location, which can be anything the player can interact with using combinations.
     */
    export interface IFeature extends ICombinable {
        /**
         * The description of this feature as shown to the player. This can also be set in the location
         * HTML file by adding a <feature name="{featureName}"> tag.
         */
        description?: string;
    }
}