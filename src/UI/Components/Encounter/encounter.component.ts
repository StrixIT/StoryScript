import { IGame, IInterfaceTexts, IItem, ITrade, IPerson } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core'
import { getTemplate } from '../../helpers';
import { TradeService } from 'storyScript/Services/TradeService';

@Component({
    selector: 'encounter',
    template: getTemplate('encounter', require('./encounter.component.html'))
})
export class EncounterComponent {
    constructor(private _tradeService: TradeService, private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    personsPresent = (): boolean => this.game.currentLocation && this.game.currentLocation.activePersons && this.game.currentLocation.activePersons.length > 0;

    hasDescription = (person: IPerson): boolean => this._sharedMethodService.hasDescription(person);

    showDescription = (person: IPerson, title: string): void => this._sharedMethodService.showDescription('person', person, title);  

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (person: IPerson): boolean => this._sharedMethodService.tryCombine(person);

    talk = (person: IPerson): void => this._sharedMethodService.talk(person);

    trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);
    
    startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(person);
}