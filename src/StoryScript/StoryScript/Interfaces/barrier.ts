module StoryScript {
    export interface IBarrier {
        name: string;
        actions?: ICollection<IBarrierAction>;
        selectedAction?: IBarrierAction;
        key?: () => IKey;
        combinations?: ICombinations<() => IItem | IFeature>;
    }
}