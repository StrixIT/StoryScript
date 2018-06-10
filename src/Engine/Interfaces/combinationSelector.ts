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
         * The list of available objects that can be used as left sides in a combination.
         */
        combineTools: any[];

        /**
         * The list of available objects that can be used as right sides in a combination.
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
         * The name of the combination tool.
         */
        tool: { name };
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