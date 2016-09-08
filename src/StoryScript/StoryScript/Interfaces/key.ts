module StoryScript {
    export interface IKey extends IItem {
        keepAfterUse?: boolean;
        open: IBarrierAction;
    }
}