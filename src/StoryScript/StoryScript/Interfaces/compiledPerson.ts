module StoryScript {
    export interface ICompiledPerson extends ICompiledEnemy {
        canAttack?: boolean;
        trade?: ITrade;
        conversation?: IConversation;
        quests?: ICollection<IQuest>;
    }
}