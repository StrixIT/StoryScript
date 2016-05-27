module StoryScript.Interfaces {
    export interface IBarrier {
        text: string;
        actions?: ICollection<IBarrierAction>;
        selectedAction?: IBarrierAction;
        key?: () => IKey;
    }
}