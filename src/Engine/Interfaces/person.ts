namespace StoryScript {
    /**
     * A character the player can talk or trade with.
     */
    export interface IPerson extends IEnemy {
        /**
         * True if the player can attack the character, false otherwise.
         */
        canAttack?: boolean;

        /**
         * The trade settings for the person.
         */
        trade?: ITrade;

        /**
         * The conversation options for the person.
         */
        conversation?: IConversationOptions;

        /**
         * The quests this person has available.
         */
        quests?: ICollection<() => IQuest>;
    }
}