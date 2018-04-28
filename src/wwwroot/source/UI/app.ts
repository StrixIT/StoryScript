namespace StoryScript {
    addFunctionExtensions();
    addArrayExtensions();

    var storyScriptModule = angular.module("storyscript", ['ngSanitize', 'strixIT']);

    var game = {};
    storyScriptModule.value('game', game);
    var definitions = {};
    storyScriptModule.value('definitions', definitions);
    var rules = {};
    storyScriptModule.value('rules', rules);

    storyScriptModule.service("httpService", HttpService);
    storyScriptModule.service("localStorageService", LocalStorageService);
    storyScriptModule.service("dataService", DataService);
    storyScriptModule.service("locationService", LocationService);
    storyScriptModule.service("characterService", CharacterService);
    storyScriptModule.service("gameService", GameService);
    storyScriptModule.service("helperService", HelperService);

    storyScriptModule.controller("MainController", MainController);
    storyScriptModule.controller("ConversationController", ConversationController);
    storyScriptModule.controller("TradeController", TradeController);
    storyScriptModule.controller("CharacterController", CharacterController);
    storyScriptModule.controller("CreateCharacterController", CreateCharacterController);
    storyScriptModule.controller("CombinationController", CombinationController);
}