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
         * True if the action requires a target, false otherwise. E.g. 'Look at' does not require a target
         * (you can just look at something) while 'Throw at' obviously does require a target.
         */
        requiresTarget?: boolean;

        /**
         * The text to show to the player, or a function returning this text, when a combination attempt for this action fails.
         * @param game The game object
         */
        // Todo: use
        combineFailText?: string | ((game: IGame) => string);
    }
}