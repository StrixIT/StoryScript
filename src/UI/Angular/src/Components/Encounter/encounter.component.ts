import { Component } from '@angular/core'
import { IGame, IInterfaceTexts, IItem, ITrade } from '../../../../../Engine/Interfaces/storyScript';
import { IPerson } from '../../../../../Games/_TestGame/interfaces/types';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ConversationService } from '../../../../../Engine/Services/ConversationService';
import template from './encounter.component.html';
import { ObjectFactory } from '../../../../../Engine/ObjectFactory';

@Component({
    selector: 'encounter',
    template: template,
})
export class EncounterComponent {
    constructor(private _sharedMethodService: SharedMethodService, private _conversationService: ConversationService, private _objectFactory: ObjectFactory) {
        this.game = _objectFactory.GetGame();
        this.texts = _objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    personsPresent = (): boolean => this.game.currentLocation && this.game.currentLocation.activePersons && this.game.currentLocation.activePersons.length > 0;

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (person: IPerson): boolean => this._sharedMethodService.tryCombine(this.game, person);

    talk = (person: IPerson): void => this._sharedMethodService.talk(person);

    trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);
    
    startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(this.game, person);
}