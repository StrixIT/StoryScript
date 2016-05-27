module StoryScript {
    addFunctionExtensions();
    addArrayExtensions();

    var module = angular.module("storyscript", ['ngSanitize', 'ngStorage']);

    var game = new Game();
    module.value('game', game);

    module.service("dataService", DataService);
    module.service("locationService", LocationService);
    module.service("characterService", CharacterService);
    module.service("gameService", GameService);

    module.controller("MainController", MainController);
}