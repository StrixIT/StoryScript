module PathOfHeroes {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        highScores: StoryScript.ScoreEntry[];
        actionLog: string[];
        state: string;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'PathOfHeroes');
}