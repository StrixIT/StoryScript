import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/storyscript.css'
import '../../../Games/MyAdventureGame/ui/styles/game.css'

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { EncounterComponent } from './Components/Encounter/encounter.component';
import { NavigationComponent } from './Components/Navigation/navigation.component';
import { GetObjectFactory } from '../../../Engine/run';
import { SharedMethodService } from './Services/SharedMethodService';
import { GameService } from '../../../Engine/Services/gameService';
import { TradeService } from '../../../Engine/Services/TradeService';
import { ConversationService } from '../../../Engine/Services/ConversationService';
import { ObjectFactory } from '../../../Engine/ObjectFactory';
import { BackpackComponent } from './Components/Backpack/backpack.component';
import { CharacterService } from '../../../Engine/Services/characterService';
import { ActionLogComponent } from './Components/ActionLog/actionlog.component';
import { CharacterSheetComponent } from './Components/CharacterSheet/charactersheet.component';
import { CombatComponent } from './Components/Combat/combat.component';
import { LocationComponent } from './Components/Location/location.component';
import { GroundComponent } from './Components/Ground/ground.component';
import { EquipmentComponent } from './Components/Equipment/equipment.component';
import { TradeComponent } from './Components/Trade/trade.component';
import { EnemyComponent } from './Components/Enemy/enemy.component';
import { ExplorationComponent } from './Components/Exploration/exploration.component';
import { CombinationComponent } from './Components/Combination/combination.component';
import { CombinationService } from '../../../Engine/Services/CombinationService';
import { VictoryComponent } from './Components/Victory/victory.component';
import { HighScoresComponent } from './Components/HighScores/highscores.component';

import { FormsModule } from '@angular/forms';
import { EncounterModalComponent } from './Components/EncounterModal/encountermodal.component';
import { ConversationComponent } from './Components/Conversation/conversation.component';
import { BuildCharacterComponent } from './Components/BuildCharacter/buildcharacter.component';
import { CreateCharacterComponent } from './Components/CreateCharacter/createcharacter.component';
import { GameOverComponent } from './Components/GameOver/gameover.component';
import { IntroComponent } from './Components/Intro/intro.component';
import { LevelUpComponent } from './Components/LevelUp/levelup.component';
import { MainComponent } from './Components/Main/main.component';
import { QuestComponent } from './Components/Quest/quest.component';
import { SoundComponent } from './Components/Sound/sound.component';
import { MenuModalComponent } from './Components/MenuModal/menumodal.component';
import { TextFeatures } from './Directives/TextFeatures';
import { SafePipe } from './Pipes/sanitizationPipe';

import '../../../Games/MyAdventureGame/run.ts'
import '../../../Games/MyAdventureGame/all.ts'

import { registrationDone } from '../../../Engine/ObjectConstructors'

registrationDone();

var objectFactory = GetObjectFactory();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    bootstrap: [
        MainComponent
    ],
    declarations: [
        MainComponent,
        MenuModalComponent,
        NavigationComponent,
        EncounterComponent,
        BackpackComponent,
        ActionLogComponent,
        CharacterSheetComponent,
        CombatComponent,
        LocationComponent,
        GroundComponent,
        EquipmentComponent,
        TradeComponent,
        EnemyComponent,
        ExplorationComponent,
        CombinationComponent,
        VictoryComponent,
        HighScoresComponent,
        EncounterModalComponent,
        ConversationComponent,
        CreateCharacterComponent,
        BuildCharacterComponent,
        GameOverComponent,
        IntroComponent,
        LevelUpComponent,
        QuestComponent,
        SoundComponent,
        TextFeatures,
        SafePipe
    ],
    providers:[
        SharedMethodService,
        { provide: ObjectFactory, useValue: GetObjectFactory() },
        { provide: TradeService, useValue: objectFactory.GetTradeService() },
        { provide: ConversationService, useValue: objectFactory.GetConversationService() },
        { provide: GameService, useValue: objectFactory.GetGameService() },
        { provide: CharacterService, useValue: objectFactory.GetCharacterService() },
        { provide: CombinationService, useValue: objectFactory.GetCombinationService() }
    ]
})

export class AppModule {
    constructor(private _gameService: GameService) {
        this._gameService.init();
    }
}