import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/storyscript.css'
import '../../../Games/MyAdventureGame/ui/styles/game.css'
import * as angular from 'angular';
import 'angular-sanitize';
import '../../../Games/MyAdventureGame/run.ts'
import '../../../Games/MyAdventureGame/all.ts'

import { registrationDone } from '../../../Engine/ObjectConstructors'

registrationDone();

import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';

import { SharedMethodService } from './Services/SharedMethodService';
import { FeaturePicture } from './Directives/FeaturePicture';
import { TextFeatures } from './Directives/TextFeatures';
import { MainComponent } from './Components/Main/main.component';
import { EquipmentComponent } from './Components/Equipment/equipment.component';
import { QuestComponent } from './Components/Quest/quest.component';
import { LevelUpComponent } from './Components/LevelUp/levelup.component';
import { MenuModalComponent } from './Components/MenuModal/menumodal.component';
import { EncounterComponent } from './Components/Encounter/encounter.component';
import { ExplorationComponent } from './Components/Exploration/exploration.component';
import { GroundComponent } from './Components/Ground/ground.component';
import { CreateCharacterComponent } from './Components/CreateCharacter/createcharacter.component';
import { GameOverComponent } from './Components/GameOver/gameover.component';
import { VictoryComponent } from './Components/Victory/victory.component';
import { HighScoresComponent } from './Components/HighScores/highscores.component';
import { EncounterModalComponent } from './Components/EncounterModal/encountermodal.component';
import { ConversationComponent } from './Components/Conversation/conversation.component';
import { SoundComponent } from './Components/Sound/sound.component';
import { IntroComponent } from './Components/Intro/intro.component';
import { GetObjectFactory } from '../../../Engine/run';

const MODULE_NAME = 'storyscript';
export default MODULE_NAME;

var storyScriptModule = angular.module(MODULE_NAME, ['ngSanitize']);


import { NavigationComponent } from './Components/Navigation/navigation.component';
import { BackpackComponent } from './Components/Backpack/backpack.component';
import { ActionLogComponent } from './Components/ActionLog/actionlog.component';
import { CharacterSheetComponent } from './Components/CharacterSheet/charactersheet.component';
import { CombatComponent } from './Components/Combat/combat.component';
import { LocationComponent } from './Components/Location/location.component';
import { TradeComponent } from './Components/Trade/trade.component';
import { EnemyComponent } from './Components/Enemy/enemy.component';
import { CombinationComponent } from './Components/Combination/combination.component';
import { BuildCharacterComponent } from './Components/BuildCharacter/buildcharacter.component';

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

storyScriptModule
    .directive('main', downgradeComponent({component: MainComponent}))
    .directive('navigation', downgradeComponent({component: NavigationComponent}))
    .directive('encounter', downgradeComponent({component: EncounterComponent}))
    .directive('backpack', downgradeComponent({component: BackpackComponent}))
    .directive('actionlog', downgradeComponent({component: ActionLogComponent}))
    .directive('charactersheet', downgradeComponent({component: CharacterSheetComponent}))
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
    .directive('createcharacter', downgradeComponent({component: CreateCharacterComponent}))
    .directive('buildcharacter', downgradeComponent({component: BuildCharacterComponent}))
    .directive('gameover', downgradeComponent({component: GameOverComponent}))
    .directive('intro', downgradeComponent({component: IntroComponent}))
    .directive('levelup', downgradeComponent({component: LevelUpComponent}))
    .directive('quests', downgradeComponent({component: QuestComponent}))
    .directive('sound', downgradeComponent({component: SoundComponent}))
    .directive('menumodal', downgradeComponent({component: MenuModalComponent}))
    .directive('textFeatures', downgradeComponent({component: TextFeatures}))
    .factory('SharedMethodService', downgradeInjectable(SharedMethodService));