module MyNewGame {
    export interface IGame extends StoryScript.IGame {
        character: Character;
        locations: StoryScript.ICompiledCollection<ILocation, ICompiledLocation>;
        currentLocation: ICompiledLocation;
        previousLocation: ICompiledLocation;

        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => ICompiledEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string | (() => IEnemy)) => ICompiledEnemy;
        getItem: (selector: string | (() => IItem)) => IItem;
    }

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.value("gameNameSpace", 'MyNewGame');
    storyScriptModule.service("ruleService", RuleService);
    storyScriptModule.value("customTexts", new CustomTexts().texts);
}