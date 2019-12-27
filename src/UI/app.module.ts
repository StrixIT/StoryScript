import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbModalModule, NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedMethodService } from './Services/SharedMethodService';
import { ModalService } from './Services/ModalService';

import { GameService } from 'storyScript/Services/gameService';
import { TradeService } from 'storyScript/Services/TradeService';
import { CharacterService } from 'storyScript/Services/characterService';
import { ConversationService } from 'storyScript/Services/ConversationService';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { GetObjectFactory } from 'storyScript/run';

import { EncounterComponent } from './Components/Encounter/encounter.component';
import { NavigationComponent } from './Components/Navigation/navigation.component';
import { BackpackComponent } from './Components/Backpack/backpack.component';
import { ActionLogComponent } from './Components/ActionLog/actionlog.component';
import { CharacterSheetComponent } from './Components/CharacterSheet/charactersheet.component';
import { CombatComponent } from './Components/Combat/combat.component';
import { LocationTextComponent } from './Components/LocationText/locationtext.component';
import { LocationVisualComponent } from './Components/LocationVisual/locationvisual.component';
import { GroundComponent } from './Components/Ground/ground.component';
import { EquipmentComponent } from './Components/Equipment/equipment.component';
import { TradeComponent } from './Components/Trade/trade.component';
import { EnemyComponent } from './Components/Enemy/enemy.component';
import { ExplorationComponent } from './Components/Exploration/exploration.component';
import { CombinationComponent } from './Components/Combination/combination.component';
import { VictoryComponent } from './Components/Victory/victory.component';
import { HighScoresComponent } from './Components/HighScores/highscores.component';
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

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/storyscript.css';

import 'game/ui/styles/game.css'
import 'game/run';

var objectFactory = GetObjectFactory();

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgbCollapseModule,
        NgbModalModule,
        NgbDropdownModule
    ],
    bootstrap: [
        MainComponent
    ],
    entryComponents: [
        MenuModalComponent,
        EncounterModalComponent
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
        LocationTextComponent,
        LocationVisualComponent,
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
        NgbActiveModal,
        SharedMethodService,
        ModalService,
        { provide: ObjectFactory, useValue: objectFactory },
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