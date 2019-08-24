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
         * The preposition to use for the action, e.g. 'at' for 'Look at'. Some actions do not need a preposition, like pull.
         */
        preposition?: string;
        /**
         * True if the action requires a tool, false otherwise. E.g. 'Look at' does not require a tool
         * (you can just look at something) while 'Throw at' obviously does require something being thrown.
         */
        requiresTool?: boolean;

        /**
         * The text to show to the player, or a function returning this text, when a combination attempt for this action fails.
         * @param game The game object
         * @param tool The tool for the combination
         * @param target The target of the combination
         */
        failText?: string | ((game: IGame, tool: ICombinable, target: ICombinable) => string);

        /**
         * Set this to true to make this action the default. A player doesn't need to select it first to use it. If no combination
         * is active when the player selects a feature, this action will be used.
         */
        isDefault?: boolean;
    }
}