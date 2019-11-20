import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { UpgradeModule } from '@angular/upgrade/static';
import moduleName from './app.module.ajs';
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

var objectFactory = GetObjectFactory();

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        FormsModule
    ],
    declarations: [
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
        BuildCharacterComponent
    ],
    providers:[
        SharedMethodService,
        { provide: ObjectFactory, useValue: GetObjectFactory() },
        { provide: TradeService, useValue: objectFactory.GetTradeService() },
        { provide: ConversationService, useValue: objectFactory.GetConversationService() },
        { provide: GameService, useValue: objectFactory.GetGameService() },
        { provide: CharacterService, useValue: objectFactory.GetCharacterService() },
        { provide: CombinationService, useValue: objectFactory.GetCombinationService() }
    ],
    entryComponents: [
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
        BuildCharacterComponent
    ],
})

export class AppModule {
    constructor(private upgrade: UpgradeModule){
    }

    ngDoBootstrap(){
        this.upgrade.bootstrap(document.documentElement, [moduleName], {strictDi: true});
    }
}