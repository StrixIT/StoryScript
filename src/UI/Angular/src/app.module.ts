import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { UpgradeModule } from '@angular/upgrade/static';
import moduleName from './app.module.ajs';
import { EncounterComponent } from './Components/Encounter/encounter.component';
import { GetObjectFactory } from '../../../Engine/run';
import { SharedMethodService } from './Services/SharedMethodService';
import { GameService } from '../../../Engine/Services/gameService';
import { TradeService } from '../../../Engine/Services/TradeService';
import { Game } from '../../../Games/_TestGame/interfaces/game';
import { ConversationService } from '../../../Engine/Services/ConversationService';
import { CustomTexts } from '../../../Games/_TestGame/customTexts';

var objectFactory = GetObjectFactory();

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ],
    declarations: [
        EncounterComponent
    ],
    providers:[
        SharedMethodService,
        { provide: Game, useValue: objectFactory.GetGame() },
        { provide: CustomTexts, useValue: objectFactory.GetTexts() },
        { provide: TradeService, useValue: objectFactory.GetTradeService() },
        { provide: ConversationService, useValue: objectFactory.GetConversationService() },
        { provide: GameService, useValue: objectFactory.GetGameService() },
        // { provide: 'characterService', useValue: objectFactory.GetCharacterService() },
        // { provide: 'combinationService', useValue: objectFactory.GetCombinationService() }
    ],
    entryComponents: [EncounterComponent],
})

export class AppModule {
    constructor(private upgrade: UpgradeModule){
    }

    ngDoBootstrap(){
        this.upgrade.bootstrap(document.documentElement, [moduleName], {strictDi: true});
    }
}