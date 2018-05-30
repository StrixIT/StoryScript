namespace StoryScript {
    export interface IDestination {
        name: string;
        target: () => ILocation;
        barrier?: IBarrier;
        style?: string;
        inactive?: boolean;
    }
}