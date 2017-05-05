module StoryScript {
    export interface IPerson extends IEnemy {
        canAttack?: boolean;
        trade?: ITrade;
        conversation?: IConversation;
        quests?: ICollection<() => IQuest>;
    }
}