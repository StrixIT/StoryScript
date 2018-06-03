namespace StoryScript {
    /**
     * A character the player can talk or trade with, compiled for run-time.
     */
    export interface ICompiledPerson extends ICompiledEnemy {
        canAttack?: boolean;
        trade?: ITrade;
        conversation?: IConversation;
        quests?: ICollection<IQuest>;
    }
}