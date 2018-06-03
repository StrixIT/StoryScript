namespace StoryScript {
    /**
     * Combination actions that can be tried in the game, e.g. throwing an object at another object.
     */
    export interface ICombinationAction {
        /**
         * The text to display for the action in the interface (e.g. 'Look' for 'Look at')
         */
        text: string;
        /**
         * The preposition to use for the action, e.g. 'at' for 'Look at'
         */
        preposition: string;
        /**
         * True if the action requires a target to use it on, false otherwise. E.g. 'Look at' does not require a target
         * (you can just look at something) while 'Throw at' does require a target, namely the object thrown.
         */
        requiresTarget?: boolean
    }
}