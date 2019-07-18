namespace StoryScript {
    /**
     * The base properties of a character in the game the player can talk or trade with.
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
        conversation?: IConversation;

        /**
         * The quests this person has available.
         */
        quests?: ICollection<IQuest>;
    }
}