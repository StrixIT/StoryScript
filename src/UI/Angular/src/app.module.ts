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
import { Game } from '../../../Games/_TestGame/interfaces/game';
import { ConversationService } from '../../../Engine/Services/ConversationService';
import { CustomTexts } from '../../../Games/_TestGame/customTexts';
import { ObjectFactory } from '../../../Engine/ObjectFactory';
import { BackpackComponent } from './Components/Backpack/backpack.component';
import { CharacterService } from '../../../Engine/Services/characterService';
import { ActionLogComponent } from './Components/ActionLog/actionlog.component';
import { CharacterSheetComponent } from './Components/CharacterSheet/charactersheet.component';
import { CombatComponent } from './Components/Combat/combat.component';

var objectFactory = GetObjectFactory();

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ],
    declarations: [
        NavigationComponent,
        EncounterComponent,
        BackpackComponent,
        ActionLogComponent,
        CharacterSheetComponent,
        CombatComponent
    ],
    providers:[
        SharedMethodService,
        { provide: ObjectFactory, useValue: GetObjectFactory() },
        { provide: TradeService, useValue: objectFactory.GetTradeService() },
        { provide: ConversationService, useValue: objectFactory.GetConversationService() },
        { provide: GameService, useValue: objectFactory.GetGameService() },
        { provide: CharacterService, useValue: objectFactory.GetCharacterService() },
        // { provide: 'combinationService', useValue: objectFactory.GetCombinationService() }
    ],
    entryComponents: [
        NavigationComponent, 
        EncounterComponent, 
        BackpackComponent, 
        ActionLogComponent, 
        CharacterSheetComponent, 
        CombatComponent],
})

export class AppModule {
    constructor(private upgrade: UpgradeModule){
    }

    ngDoBootstrap(){
        this.upgrade.bootstrap(document.documentElement, [moduleName], {strictDi: true});
    }
}