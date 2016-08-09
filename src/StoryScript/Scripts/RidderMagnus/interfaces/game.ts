module RidderMagnus {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICompiledCollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        highScores: StoryScript.ScoreEntry[];
        actionLog: string[];
        state: string;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'RidderMagnus');
}