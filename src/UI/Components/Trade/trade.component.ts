import { IGame, IInterfaceTexts, IItem, ITrade } from 'storyScript/Interfaces/storyScript';
import { TradeService } from 'storyScript/Services/TradeService';
import { ServiceFactory } from 'storyScript/ServiceFactory.ts';
import { Component, inject } from '@angular/core';
import { getTemplate } from '../../helpers';

@Component({
    selector: 'trade',
    template: getTemplate('trade', await import('./trade.component.html?raw'))
})
export class TradeComponent {
    private _tradeService: TradeService;
    
    constructor() {
        this._tradeService = inject(TradeService);
        const objectFactory = inject(ServiceFactory);
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