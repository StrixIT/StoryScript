module StoryScript {
    addFunctionExtensions();
    addArrayExtensions();

    var storyScriptModule = angular.module("storyscript", ['ngSanitize', 'ngStorage']);

    var game = {};
    storyScriptModule.value('game', game);

    storyScriptModule.service("dataService", DataService);
    storyScriptModule.service("locationService", LocationService);
    storyScriptModule.service("characterService", CharacterService);
    storyScriptModule.service("gameService", GameService);

    storyScriptModule.controller("MainController", MainController);
}