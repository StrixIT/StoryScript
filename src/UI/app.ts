namespace StoryScript {
    var storyScriptModule = angular.module("storyscript", ['ngSanitize']);
    var objectFactory = window.StoryScript.ObjectFactory;
    
    storyScriptModule.value('eventListener', objectFactory.GetEventListener());
    storyScriptModule.value('game', objectFactory.GetGame());
    storyScriptModule.value('customTexts', objectFactory.GetTexts());
    storyScriptModule.value("tradeService", objectFactory.GetTradeService());
    storyScriptModule.value("conversationService", objectFactory.GetConversationService());
    storyScriptModule.value("gameService", objectFactory.GetGameService());
    storyScriptModule.value("characterService", objectFactory.GetCharacterService());
    storyScriptModule.value("combinationService", objectFactory.GetCombinationService());

    storyScriptModule.service("sharedMethodService", SharedMethodService);

    storyScriptModule.directive("featurePicture", FeaturePicture.Factory());
    storyScriptModule.directive("textFeatures", TextFeatures.Factory());

    storyScriptModule.component('main', {
        templateUrl: 'ui/MainComponent.html',
        controller: MainController
    });

    storyScriptModule.component('buildCharacter', {
        templateUrl: 'ui/BuildCharacterComponent.html',
        controller: BuildCharacterController,
        bindings: {
            sheet: '<'
        }
    });

    storyScriptModule.component('characterSheet', {
        templateUrl: 'ui/CharacterSheetComponent.html',
        controller: CharacterSheetController
    });

    storyScriptModule.component('equipment', {
        templateUrl: 'ui/EquipmentComponent.html',
        controller: EquipmentController
    });

    storyScriptModule.component('backpack', {
        templateUrl: 'ui/BackpackComponent.html',
        controller: BackpackController
    });
    
    storyScriptModule.component('quests', {
        templateUrl: 'ui/QuestComponent.html',
        controller: QuestController
    });

    storyScriptModule.component('levelUp', {
        templateUrl: 'ui/LevelUpComponent.html',
        controller: LevelUpController
    });

    storyScriptModule.component('navigation', {
        templateUrl: 'ui/NavigationComponent.html',
        controller: NavigationController
    });

    storyScriptModule.component('menuModal', {
        templateUrl: 'ui/MenuModalComponent.html',
        controller: MenuModalController
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

    storyScriptModule.component('ground', {
        templateUrl: 'ui/GroundComponent.html',
        controller: GroundController
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

    storyScriptModule.component('sound', {
        templateUrl: 'ui/SoundComponent.html',
        controller: SoundController
    });

    storyScriptModule.component('intro', {
        templateUrl: 'ui/IntroComponent.html',
        controller: IntroController
    });
}