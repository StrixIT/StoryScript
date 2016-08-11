module PathOfHeroes {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICompiledCollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        highScores: StoryScript.ScoreEntry[];
        actionLog: string[];
        state: string;
        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'PathOfHeroes');
}