import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/storyscript.css'
import '../../../Games/_TestGame/ui/styles/game.css'
import * as angular from 'angular';
import 'angular-sanitize';
import '../../../Games/_TestGame/run.ts'
import '../../../Games/_TestGame/all.ts'

import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';

import { SharedMethodService } from './Services/SharedMethodService';
import { BuildCharacterController } from './Components/BuildCharacter/BuildCharacterController';
import { FeaturePicture } from './Directives/FeaturePicture';
import { TextFeatures } from './Directives/TextFeatures';
import { MainController } from './Components/Main/MainController';
import { EquipmentComponent } from './Components/Equipment/equipment.component';
import { QuestController } from './Components/Quest/QuestController';
import { LevelUpController } from './Components/LevelUp/LevelUpController';
import { MenuModalController } from './Components/MenuModal/MenuModalController';
import { EncounterComponent } from './Components/Encounter/encounter.component';
import { ExplorationComponent } from './Components/Exploration/exploration.component';
import { GroundComponent } from './Components/Ground/ground.component';
import { CreateCharacterController } from './Components/CreateCharacter/CreateCharacterController';
import { GameOverController } from './Components/GameOver/GameOverController';
import { VictoryComponent } from './Components/Victory/victory.component';
import { HighScoresComponent } from './Components/HighScores/highscores.component';
import { EncounterModalComponent } from './Components/EncounterModal/encountermodal.component';
import { ConversationComponent } from './Components/Conversation/conversation.component';
import { SoundController } from './Components/Sound/SoundController';
import { IntroController } from './Components/Intro/IntroController';
import { GetObjectFactory } from '../../../Engine/run';

const MODULE_NAME = 'storyscript';
export default MODULE_NAME;

var storyScriptModule = angular.module(MODULE_NAME, ['ngSanitize']);

import '../../../../dist/js/ui-templates.js'
import { NavigationComponent } from './Components/Navigation/navigation.component';
import { BackpackComponent } from './Components/Backpack/backpack.component';
import { ActionLogComponent } from './Components/ActionLog/actionlog.component';
import { CharacterSheetComponent } from './Components/CharacterSheet/charactersheet.component';
import { CombatComponent } from './Components/Combat/combat.component';
import { LocationComponent } from './Components/Location/location.component';
import { TradeComponent } from './Components/Trade/trade.component';
import { EnemyComponent } from './Components/Enemy/enemy.component';
import { CombinationComponent } from './Components/Combination/combination.component';

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

storyScriptModule.component('quests', {
    templateUrl: 'ui/QuestComponent.html',
    controller: QuestController
});

storyScriptModule.component('levelUp', {
    templateUrl: 'ui/LevelUpComponent.html',
    controller: LevelUpController
});

storyScriptModule.component('menuModal', {
    templateUrl: 'ui/MenuModalComponent.html',
    controller: MenuModalController
});

storyScriptModule.component('createCharacter', {
    templateUrl: 'ui/CreateCharacterComponent.html',
    controller: CreateCharacterController
});

storyScriptModule.component('gameOver', {
    templateUrl: 'ui/GameOverComponent.html',
    controller: GameOverController
});

storyScriptModule.component('sound', {
    templateUrl: 'ui/SoundComponent.html',
    controller: SoundController
});

storyScriptModule.component('intro', {
    templateUrl: 'ui/IntroComponent.html',
    controller: IntroController
});

storyScriptModule
    .directive('navigation', downgradeComponent({component: NavigationComponent}))
    .directive('encounter', downgradeComponent({component: EncounterComponent}))
    .directive('backpack', downgradeComponent({component: BackpackComponent}))
    .directive('actionlog', downgradeComponent({component: ActionLogComponent}))
    .directive('characterSheet', downgradeComponent({component: CharacterSheetComponent}))
    .directive('combat', downgradeComponent({component: CombatComponent}))
    .directive('location', downgradeComponent({component: LocationComponent}))
    .directive('ground', downgradeComponent({component: GroundComponent}))
    .directive('equipment', downgradeComponent({component: EquipmentComponent}))
    .directive('trade', downgradeComponent({component: TradeComponent}))
    .directive('enemy', downgradeComponent({component: EnemyComponent}))
    .directive('exploration', downgradeComponent({component: ExplorationComponent}))
    .directive('combination', downgradeComponent({component: CombinationComponent}))
    .directive('victory', downgradeComponent({component: VictoryComponent}))
    .directive('highscores', downgradeComponent({component: HighScoresComponent}))
    .directive('encountermodal', downgradeComponent({component: EncounterModalComponent}))
    .directive('conversation', downgradeComponent({component: ConversationComponent}))
    .factory('SharedMethodService', downgradeInjectable(SharedMethodService));