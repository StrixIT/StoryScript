import 'zone.js';
import '@angular/compiler';
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from "@angular/platform-browser";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SharedMethodService} from "./Services/SharedMethodService.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {DataService} from "storyScript/Services/DataService.ts";
import {TradeService} from "storyScript/Services/TradeService.ts";
import {ConversationService} from "storyScript/Services/ConversationService.ts";
import {GameService} from "storyScript/Services/GameService.ts";
import {CharacterService} from "storyScript/Services/CharacterService.ts";
import {CombinationService} from "storyScript/Services/CombinationService.ts";
import {CombatService} from "storyScript/Services/CombatService.ts";
import {SoundService} from "storyScript/Services/SoundService.ts";
import {ItemService} from "storyScript/Services/ItemService.ts";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'ui/styles/storyscript.css';
import 'game/ui/styles/game.css'
import 'game/run';

// The production setting is triggered when using the webpack.production config.
if (process.env.NODE_ENV === 'production') {
    enableProdMode();
}

const serviceFactory = ServiceFactory.GetInstance();

bootstrapApplication(null, {
    providers: [
        NgbActiveModal,
        SharedMethodService,
        {provide: ServiceFactory, useValue: serviceFactory},
        {provide: DataService, useValue: serviceFactory.GetDataService()},
        {provide: TradeService, useValue: serviceFactory.GetTradeService()},
        {provide: ConversationService, useValue: serviceFactory.GetConversationService()},
        {provide: GameService, useValue: serviceFactory.GetGameService()},
        {provide: CharacterService, useValue: serviceFactory.GetCharacterService()},
        {provide: CombinationService, useValue: serviceFactory.GetCombinationService()},
        {provide: CombatService, useValue: serviceFactory.GetCombatService()},
        {provide: SoundService, useValue: serviceFactory.GetSoundService()},
        {provide: ItemService, useValue: serviceFactory.GetItemService()},
    ],
});