module StoryScript {
    export interface IDestination {
        text: string;
        target: () => ILocation;
        barrier?: IBarrier;
    }
}