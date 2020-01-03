import { IGame, IInterfaceTexts, IItem, ITrade, IPerson } from 'storyScript/Interfaces/storyScript';
import { SharedMethodService } from '../../Services/SharedMethodService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core'
import { getTemplate } from '../../helpers';

@Component({
    selector: 'encounter',
    template: getTemplate('encounter', require('./encounter.component.html'))
})
export class EncounterComponent {
    constructor(private _sharedMethodService: SharedMethodService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent(this.game);

    personsPresent = (): boolean => this.game.currentLocation && this.game.currentLocation.activePersons && this.game.currentLocation.activePersons.length > 0;

    getCombineClass = (item: IItem): string => this.game.combinations.getCombineClass(item);

    tryCombine = (person: IPerson): boolean => this._sharedMethodService.tryCombine(this.game, person);

    talk = (person: IPerson): void => this._sharedMethodService.talk(this.game, person);

    trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(this.game, trade);
    
    startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(this.game, person);
}