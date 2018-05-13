namespace StoryScript {
    export interface ISaveGame {
        name?: string;
        character: ICharacter;
        statistics: IStatistics;
        location: string;
        previousLocation: string;
        worldProperties: any;
        world: ICompiledCollection<ILocation, ICompiledLocation>;
    }
}