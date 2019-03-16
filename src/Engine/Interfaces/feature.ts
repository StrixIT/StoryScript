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

        /**
         * The name of the image map this feature is part of when using image maps for visual features.
         */
        map?: string;

        /**
         * The coordinates of this feature when using image maps for visual features.
         */
        coords?: string;

         /**
         * The shape of this feature when using image maps for visual features.
         */
        shape?: string;

        /**
         * The file path for a custom picture to show on top of the image map for this feature when using 
         * image maps for visual features. The path should be relative to the resources folder.
         */
        picture?: string;
    }
}