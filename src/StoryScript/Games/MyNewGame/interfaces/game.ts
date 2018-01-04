module MyNewGame {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICompiledCollection<ILocation, ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'MyNewGame');
    storyScriptModule.value("rules", new Rules());
    storyScriptModule.value("customTexts", new CustomTexts().texts);
}