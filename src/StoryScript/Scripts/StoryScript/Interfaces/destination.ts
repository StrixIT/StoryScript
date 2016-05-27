module StoryScript.Interfaces {
    export interface IDestination {
        text: string;
        target: () => ILocation;
        barrier?: Interfaces.IBarrier;
    }
}