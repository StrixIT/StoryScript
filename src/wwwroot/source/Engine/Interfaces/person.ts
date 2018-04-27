namespace StoryScript {
    export interface IPerson extends IEnemy {
        canAttack?: boolean;
        trade?: ITrade;
        conversation?: IConversationOptions;
        quests?: ICollection<() => IQuest>;
    }
}