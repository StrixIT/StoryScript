namespace StoryScript {
    /**
     * A character the player can talk or trade with, compiled for run-time.
     */
    export interface ICompiledPerson extends ICompiledEnemy {
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