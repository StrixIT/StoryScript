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
    storyScriptModule.service("sharedMethodService", SharedMethodService);

    storyScriptModule.controller("CharacterController", CharacterController);

    storyScriptModule.component('main', {
        templateUrl: 'ui/MainComponent.html',
        controller: MainController
    });

    storyScriptModule.component('navigation', {
        templateUrl: 'ui/NavigationComponent.html',
        controller: NavigationController
    });

    storyScriptModule.component('encounter', {
        templateUrl: 'ui/EncounterComponent.html',
        controller: EncounterController
    });

    storyScriptModule.component('location', {
        templateUrl: 'ui/LocationComponent.html',
        controller: LocationController
    });

    storyScriptModule.component('combination', {
        templateUrl: 'ui/CombinationComponent.html',
        controller: CombinationController
    });

    storyScriptModule.component('exploration', {
        templateUrl: 'ui/ExplorationComponent.html',
        controller: ExplorationController
    });

    storyScriptModule.component('enemy', {
        templateUrl: 'ui/EnemyComponent.html',
        controller: EnemyController
    });

    storyScriptModule.component('actionLog', {
        templateUrl: 'ui/ActionLogComponent.html',
        controller: ActionLogController
    });

    storyScriptModule.component('createCharacter', {
        templateUrl: 'ui/CreateCharacterComponent.html',
        controller: CreateCharacterController
    });

    storyScriptModule.component('gameOver', {
        templateUrl: 'ui/GameOverComponent.html',
        controller: GameOverController
    });

    storyScriptModule.component('victory', {
        templateUrl: 'ui/VictoryComponent.html',
        controller: VictoryController
    });

    storyScriptModule.component('highScores', {
        templateUrl: 'ui/HighScoresComponent.html',
        controller: HighScoresController
    });

    storyScriptModule.component('encounterModal', {
        templateUrl: 'ui/EncounterModalComponent.html',
        controller: EncounterModalController
    });

    storyScriptModule.component('combat', {
        templateUrl: 'ui/CombatComponent.html',
        controller: CombatController
    });

    storyScriptModule.component('trade', {
        templateUrl: 'ui/TradeComponent.html',
        controller: TradeController
    });

    storyScriptModule.component('conversation', {
        templateUrl: 'ui/ConversationComponent.html',
        controller: ConversationController
    });
}