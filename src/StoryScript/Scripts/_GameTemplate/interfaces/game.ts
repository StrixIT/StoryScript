module GameTemplate {
    export interface IGame extends StoryScript.IGame {
        definitions: IDefinitions;
        character: Character;
        locations: StoryScript.ICompiledCollection<ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;
        highScores: StoryScript.ScoreEntry[];
        actionLog: string[];
        state: string;
        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => IEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string | (() => IEnemy)) => IEnemy;
        getItem: (selector: string | (() => IItem)) => IItem;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'GameTemplate');
}