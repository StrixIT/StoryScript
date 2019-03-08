namespace MyAdventureGame {
    //Your game-specific game interface.
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICompiledCollection<ILocation, ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
    }
}