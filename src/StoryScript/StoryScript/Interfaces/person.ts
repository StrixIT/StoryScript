module StoryScript {
    export interface IPerson extends IEnemy {
        disposition: Disposition;
        trade?: ITrade;
        conversation?: IConversation;
        currency: number;
    }
}