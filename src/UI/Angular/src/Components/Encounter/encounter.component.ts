import { Component } from '@angular/core'
import { IGame, IInterfaceTexts, IItem, ITrade } from '../../../../../Engine/Interfaces/storyScript';
import { IPerson, Game, CustomTexts } from '../../../../../Games/_TestGame/interfaces/types';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ConversationService } from '../../../../../Engine/Services/ConversationService';
import template from './encounter.component.html';

@Component({
    selector: 'encounter',
    template: template,
})
export class EncounterComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _conversationService: ConversationService, private _game: Game, private _texts: CustomTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    personsPresent = (): boolean => this._game.currentLocation && this._game.currentLocation.activePersons && this._game.currentLocation.activePersons.length > 0;

    getCombineClass = (item: IItem): string => this._game.combinations.getCombineClass(item);

    tryCombine = (person: IPerson): boolean => this._game.combinations.tryCombine(person);

    talk = (person: IPerson): void => this._conversationService.talk(person);

    trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);
    
    startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(person);
}

EncounterComponent.$inject = ['sharedMethodService', 'conversationService', 'game', 'customTexts'];