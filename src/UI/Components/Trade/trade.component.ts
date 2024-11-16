import {ICharacter, IGame, IInterfaceTexts, IItem, ITrade} from 'storyScript/Interfaces/storyScript';
import {TradeService} from 'storyScript/Services/TradeService';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {Component, inject} from '@angular/core';
import {getTemplate} from '../../helpers';
import {CommonModule} from "@angular/common";
import {SafePipe} from "ui/Pipes/sanitizationPipe.ts";

@Component({
    standalone: true,
    selector: 'trade',
    // The SafePipe is used in the template, don't remove it.
    imports: [CommonModule, SafePipe],
    template: getTemplate('trade', await import('./trade.component.html?raw'))
})
export class TradeComponent {
    private readonly _tradeService: TradeService;

    constructor() {
        this._tradeService = inject(TradeService);
        const objectFactory = inject(ServiceFactory);
        this.game = objectFactory.GetGame();
        this.texts = objectFactory.GetTexts();
    }

    game: IGame;
    texts: IInterfaceTexts;
    confirmBuyItem: IItem;
    confirmSellItem: IItem;

    canPay = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => this._tradeService.canPay(item, buyer, seller);

    actualPrice = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): number => this._tradeService.actualPrice(item, buyer, seller);

    displayPrice = (item: IItem, actualPrice: number): string => this._tradeService.displayPrice(item, actualPrice);

    cancelBuy = (): void => this.confirmBuyItem = undefined;

    buy = (item: IItem, trade: ITrade): boolean => {
        if (item.value > 0 && !this.confirmBuyItem) {
            this.confirmBuyItem = item;
            return true;
        }

        this.confirmBuyItem = undefined;
        return this._tradeService.buy(item, trade);
    }

    cancelSell = (): void => this.confirmSellItem = undefined;

    sell = (item: IItem, trade: ITrade): boolean => {
        if (item.value > 0 && !this.confirmSellItem) {
            this.confirmSellItem = item;
            return true;
        }

        this.confirmSellItem = undefined;
        return this._tradeService.sell(item, trade);
    }
}