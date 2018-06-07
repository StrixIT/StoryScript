namespace StoryScript {
    /**
     * An object that contains the combinations available to the user.
     */
    export interface ICombinationSelector {
        /**
         * The currently selected combination.
         */
        combination: ICombination;

        /**
         * The list of available sources that combination targets can be used with.
         */
        combineSources: any[];

        /**
         * The combination targets available.
         */
        combineTargets: any[];

        /**
         * All available combination actions.
         */
        combineActions: ICombinationAction[];
    }

    /**
     * A combination object for display.
     */
    export interface ICombination {
        /**
         * The name of the source the combination target can be used with.
         */
        source: { name };
        /**
         * The name of the combination target.
         */
        target: { name };

        /**
         * The combination type.
         */
        type: ICombinationAction;
    }
}