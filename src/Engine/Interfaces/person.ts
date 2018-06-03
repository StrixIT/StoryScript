namespace StoryScript {
    /**
     * A character the player can talk or trade with.
     */
    export interface IPerson extends IEnemy {
        /**
         * True if the player can attack the character, false otherwise.
         */
        canAttack?: boolean;
        trade?: ITrade;
        conversation?: IConversationOptions;
        quests?: ICollection<() => IQuest>;
    }
}