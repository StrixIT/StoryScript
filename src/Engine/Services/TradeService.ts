import { IGame } from '../Interfaces/game';
import { IInterfaceTexts } from '../Interfaces/interfaceTexts';
import { IPerson } from '../Interfaces/person';
import { ITrade } from '../Interfaces/trade';
import { IItem } from '../Interfaces/item';
import { IStock } from '../Interfaces/stock';
import { randomList } from '../utilities';
import { ITradeService } from '../Interfaces/services/tradeService';
import { PlayState } from '../Interfaces/enumerations/playState';
import { IParty } from '../Interfaces/party';
import {StateProperties} from "storyScript/stateProperties.ts";

export class TradeService implements ITradeService {
    constructor(private _game: IGame, private _texts: IInterfaceTexts) {
    }

    trade = (trade: IPerson | ITrade): void => {
        const isPerson = trade && trade['type'] === 'person';

        this._game.trade = isPerson ? (<IPerson>trade).trade : trade;
        const trader = this._game.trade;

        if (isPerson) {
            trader.currency = (<IPerson>trade).currency;
            this._game.person = <IPerson>trade;

            if (!trader.name) {
                trader.name = this._texts.format(this._texts.trade, [(<IPerson>trade).name]);
            }
        } else {
            trader.ownItemsOnly = false;
        }

        this.initTrade();
        this._game.playState = PlayState.Trade;
    }

    canPay = (currency: number, value: number): boolean => (value != undefined && currency != undefined && currency >= value) || value == 0;

    actualPrice = (item: IItem, modifier: number | (() => number)): number => {
        modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(this._game) : modifier;
        return Math.round(item.value * <number>modifier);
    }

    displayPrice = (item: IItem, actualPrice: number): string => actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + this._texts.currency) : item.name;

    buy = (item: IItem, trade: ITrade): boolean => {
        if (!this.pay(item, trade, trade.buy, this._game.party, false)) {
            return false;
        }

        trade.buy.items.delete(item);
        this._game.activeCharacter.items.add(item);

        if (trade.onBuy) {
            trade.onBuy(this._game, item);
        }

        return true;
    }

    sell = (item: IItem, trade: ITrade): boolean => {
        if (!this.pay(item, trade, trade.sell, this._game.party, true)) {
            return false;
        }

        this._game.activeCharacter.items.delete(item);
        trade.sell.items.delete(item);
        trade.buy.items.add(item);

        if (trade.onSell) {
            trade.onSell(this._game, item);
        }

        return true;
    }

    private initTrade = (): ITrade => {
        const trader = this._game.trade;

        if (!trader) {
            return null;
        }
        
        let itemsForSale = trader.buy.items ? trader.buy.items.slice() : undefined;

        const buySelector = (item: IItem) => {
            return trader.buy.itemSelector(this._game, item);
        };

        // When visiting a trader for the first time and he has an initCollection function set, set the items for sale.
        if (!trader[StateProperties.Triggered] && (trader.buy.initCollection?.(this._game, trader) || !itemsForSale)) {
            const collection = <any>(trader.ownItemsOnly ? this._game.person.items : this._game.definitions.items);
            itemsForSale = randomList<IItem>(collection, trader.buy.maxItems, buySelector);
            trader[StateProperties.Triggered] = true;
        }

        const sellSelector = (item: IItem) => {
            return trader.sell.itemSelector(this._game, item);
        };

        const itemsToSell = randomList<IItem>(this._game.activeCharacter.items, trader.sell.maxItems, sellSelector);

        if (!trader.buy.items) {
            trader.buy.items = [];
        }

        // Use add instead of push here so the items added for the player to buy are tracked on edit updates.
        // Also do filter existing items using the buy selector, so items that were added before but should not
        // be available from the trader anymore are removed. Also do apply the maxItems property again.
        trader.buy.items.length = 0;
        itemsForSale?.filter(buySelector).slice(0, trader.buy.maxItems).forEach(i => trader.buy.items.add(i));

        if (!trader.sell.items) {
            trader.sell.items = [];
        }

        trader.sell.items.length = 0;
        itemsToSell.forEach(i => trader.sell.items.push(i));

        return trader;
    }

    private pay = (item: IItem, trader: ITrade, stock: IStock, party: IParty, characterSells: boolean): boolean => {
        let price = item.value;

        if (stock.priceModifier != undefined) {
            const modifier = typeof stock.priceModifier === 'function' ? (<any>stock).priceModifier(this._game) : stock.priceModifier;
            price = Math.round(item.value * modifier);
        }

        party.currency = party.currency || 0;
        trader.currency = trader.currency || 0;

        const canAffort = characterSells ? trader.currency - price >= 0 : party.currency - price >= 0;

        if (canAffort) {
            party.currency = characterSells ? party.currency + price : party.currency - price;

            if (trader.currency != undefined) {
                trader.currency = characterSells ? trader.currency - price : trader.currency + price;
            }

            if (this._game.person && this._game.person.trade === this._game.trade) {
                this._game.person.currency = this._game.trade.currency;
            }

        }

        return canAffort;
    }
}