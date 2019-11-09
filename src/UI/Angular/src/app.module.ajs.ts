import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/storyscript.css'
import '../../../Games/_TestGame/ui/styles/game.css'
import * as angular from 'angular';
import 'angular-sanitize';
import '../../../Games/_TestGame/run.ts'
import '../../../Games/_TestGame/all.ts'

import { SharedMethodService } from './Services/SharedMethodService';
import { BackpackController } from './Components/Backpack/BackpackController';
import { ActionLogController } from './Components/ActionLog/ActionLogController';
import { BuildCharacterController } from './Components/BuildCharacter/BuildCharacterController';
import { CharacterSheetController } from './Components/CharacterSheet/CharacterSheetController';
import { CombinationController } from './Components/Combination/CombinationController';
import { CombatController } from './Components/Combat/CombatController';
import { FeaturePicture } from './Directives/FeaturePicture';
import { TextFeatures } from './Directives/TextFeatures';
import { MainController } from './Components/Main/MainController';
import { EquipmentController } from './Components/Equipment/EquipmentController';
import { QuestController } from './Components/Quest/QuestController';
import { LevelUpController } from './Components/LevelUp/LevelUpController';
import { NavigationController } from './Components/Navigation/NavigationController';
import { MenuModalController } from './Components/MenuModal/MenuModalController';
import { EncounterController } from './Components/Encounter/EncounterController';
import { LocationController } from './Components/Location/LocationController';
import { ExplorationController } from './Components/Exploration/ExplorationController';
import { GroundController } from './Components/Ground/GroundController';
import { EnemyController } from './Components/Enemy/EnemyController';
import { CreateCharacterController } from './Components/CreateCharacter/CreateCharacterController';
import { GameOverController } from './Components/GameOver/GameOverController';
import { VictoryController } from './Components/Victory/VictoryController';
import { HighScoresController } from './Components/HighScores/HighScoresController';
import { EncounterModalController } from './Components/EncounterModal/EncounterModalController';
import { TradeController } from './Components/Trade/TradeController';
import { ConversationController } from './Components/Conversation/ConversationController';
import { SoundController } from './Components/Sound/SoundController';
import { IntroController } from './Components/Intro/IntroController';
import { GetObjectFactory } from '../../../Engine/run';

const MODULE_NAME = 'storyscript';
export default MODULE_NAME;

var storyScriptModule = angular.module(MODULE_NAME, ['ngSanitize']);

import '../../../../dist/js/ui-templates.js'

var objectFactory = GetObjectFactory();

storyScriptModule.value('game', objectFactory.GetGame());
storyScriptModule.value('customTexts', objectFactory.GetTexts());
storyScriptModule.value('tradeService', objectFactory.GetTradeService());
storyScriptModule.value('conversationService', objectFactory.GetConversationService());
storyScriptModule.value('gameService', objectFactory.GetGameService());
storyScriptModule.value('characterService', objectFactory.GetCharacterService());
storyScriptModule.value('combinationService', objectFactory.GetCombinationService());

storyScriptModule.service('sharedMethodService', SharedMethodService);

storyScriptModule.directive('featurePicture', ['game', FeaturePicture.Factory()]);
storyScriptModule.directive('textFeatures', ['combinationService', 'game', TextFeatures.Factory()]);

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