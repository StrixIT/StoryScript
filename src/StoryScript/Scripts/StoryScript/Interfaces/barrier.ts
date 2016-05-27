module StoryScript {
    export interface IBarrier {
        text: string;
        actions?: ICollection<IBarrierAction>;
        selectedAction?: IBarrierAction;
        key?: () => IKey;
    }
}