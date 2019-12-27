import { IGame, IInterfaceTexts, IItem, ITrade } from 'storyScript/Interfaces/storyScript';
import { TradeService } from 'storyScript/Services/TradeService';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { Component } from '@angular/core';
import template from './trade.component.html';

@Component({
    selector: 'trade',
    template: template,
})
export class TradeComponent {
    constructor(private _tradeService: TradeService, objectFactory: ObjectFactory) {
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;

    canPay = (currency: number, value: number): boolean => {
        return this._tradeService.canPay(currency, value);
    }

    actualPrice = (item: IItem, modifier: number | (() => number)): number => this._tradeService.actualPrice(item, modifier);

    displayPrice = (item: IItem, actualPrice: number): string  => this._tradeService.displayPrice(item, actualPrice);

    buy = (item: IItem, trade: ITrade): boolean => this._tradeService.buy(item, trade);
    
    sell = (item: IItem, trade: ITrade): boolean => this._tradeService.sell(item, trade);
}