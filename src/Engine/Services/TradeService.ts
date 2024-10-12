import {IGame} from '../Interfaces/game';
import {IInterfaceTexts} from '../Interfaces/interfaceTexts';
import {IPerson} from '../Interfaces/person';
import {ITrade} from '../Interfaces/trade';
import {IItem} from '../Interfaces/item';
import {IStock} from '../Interfaces/stock';
import {ITradeService} from '../Interfaces/services/tradeService';
import {PlayState} from '../Interfaces/enumerations/playState';
import {IParty} from '../Interfaces/party';
import {StateProperties} from "storyScript/stateProperties.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {randomList} from "storyScript/Services/sharedFunctions.ts";
import {IItemService} from "storyScript/Interfaces/services/itemService.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";

export class TradeService implements ITradeService {
    constructor(private _itemService: IItemService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts, private _definitions: IDefinitions) {
    }

    trade = (trade: IPerson | ITrade): void => {
        const isPerson = trade && trade['type'] === 'person';
        const person = <IPerson>trade;

        this._game.trade = isPerson ? person.trade : trade;
        const trader = this._game.trade;

        if (isPerson) {
            trader.currency = person.currency;
            this._game.person = person;

            if (!trader.name) {
                trader.name = this._texts.format(this._texts.trade, [person.name]);
            }
        } else {
            trader.ownItemsOnly = false;
        }

        this.initTrade();
        this._game.playState = PlayState.Trade;
    }

    canPay = (item: IItem, buyer: ITrade | ICharacter, currency: number, value: number): boolean => {
        if (this._rules.general.canBuyItem && !this._rules.general.canBuyItem(this._game, item, buyer)) {
            return false;
        }

        return (value != undefined && currency != undefined && currency >= value) || value == 0;
    };

    actualPrice = (item: IItem, modifier: number | (() => number)): number => {
        let resolvedModifier: number;

        if (modifier == undefined) {
            resolvedModifier = 1;
        } else if (typeof modifier === 'function') {
            resolvedModifier = (<((game: IGame) => number)>modifier)(this._game)
        } else {
            resolvedModifier = modifier;
        }

        return Math.round(item.value * resolvedModifier);
    }

    displayPrice = (item: IItem, actualPrice: number): string => actualPrice > 0 ? (`${this._itemService.getItemName(item)}: '${actualPrice} ${this._texts.currency}`) : this._itemService.getItemName(item);

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

        let itemsForSale: IItem[];

        if (trader.buy.items) {
            itemsForSale = trader.buy.items.slice();
        } else if (trader[StateProperties.Triggered]) {
            itemsForSale = []
        }

        const buySelector = (item: IItem) => {
            return trader.buy.itemSelector(this._game, item);
        };

        // When visiting a trader for the first time and he has an initCollection function set, set the items for sale.
        if (trader.buy.initCollection?.(this._game, trader) || !itemsForSale) {
            const collection = <any>(trader.ownItemsOnly ? this._game.person.items : this._definitions.items);
            itemsForSale = randomList<IItem>(collection, trader.buy.maxItems, buySelector);
            trader[StateProperties.Triggered] = true;
        }

        const sellSelector = (item: IItem) => {
            return trader.sell.itemSelector(this._game, item);
        };

        const itemsToSell = randomList<IItem>(this._game.activeCharacter.items, trader.sell.maxItems, sellSelector);
        trader.buy.items ??= []

        // Filter existing items using the buy selector, also when edits are made, so items that were 
        // added before but should not be available from the trader anymore are removed. Also do apply
        // the maxItems property on edits as well.
        trader.buy.items.length = 0;
        itemsForSale?.filter(buySelector).slice(0, trader.buy.maxItems).forEach(i => trader.buy.items.add(i));

        trader.sell.items ??= [];
        trader.sell.items.length = 0;
        itemsToSell.forEach(i => trader.sell.items.push(i));
        
        trader.buy.confirmationText ??= this._texts.buyConfirmationText;
        trader.sell.confirmationText ??= this._texts.sellConfirmationText;

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

        const canAfford = characterSells ? trader.currency - price >= 0 : party.currency - price >= 0;

        if (canAfford) {
            party.currency = characterSells ? party.currency + price : party.currency - price;

            if (trader.currency != undefined) {
                trader.currency = characterSells ? trader.currency - price : trader.currency + price;
            }

            if (this._game.person && this._game.person.trade === this._game.trade) {
                this._game.person.currency = this._game.trade.currency;
            }

        }

        return canAfford;
    }
}