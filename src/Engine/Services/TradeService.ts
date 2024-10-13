import {IGame} from '../Interfaces/game';
import {IInterfaceTexts} from '../Interfaces/interfaceTexts';
import {IPerson} from '../Interfaces/person';
import {ITrade} from '../Interfaces/trade';
import {IItem} from '../Interfaces/item';
import {ITradeService} from '../Interfaces/services/tradeService';
import {PlayState} from '../Interfaces/enumerations/playState';
import {StateProperties} from "storyScript/stateProperties.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {randomList} from "storyScript/Services/sharedFunctions.ts";
import {IItemService} from "storyScript/Interfaces/services/itemService.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IGroupableItem} from "storyScript/Interfaces/groupableItem.ts";

export class TradeService implements ITradeService {
    private _activeTrader: IPerson;
    
    constructor(private _itemService: IItemService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts, private _definitions: IDefinitions) {
    }

    trade = (trade: IPerson | ITrade): void => {
        const isPerson = trade && trade['type'] === 'person';
        const person = <IPerson>trade;

        if (isPerson) {
            this._activeTrader = this._game.person = person;
            this._game.trade = person.trade;
            this._game.trade.currency = person.currency ?? 0;

            if (!this._game.trade.name) {
                this._game.trade.name = this._texts.format(this._texts.trade, [person.name]);
            }
        } else {
            this._activeTrader = <IPerson>{ currency: trade.currency ?? 0 };
            this._game.trade = trade;
            this._game.trade.ownItemsOnly = false;
        }

        this.initTrade();
        this._game.playState = PlayState.Trade;
    }

    canPay = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): boolean => {
        if (this._rules.general.canBuyItem && !this._rules.general.canBuyItem(this._game, item, buyer)) {
            return false;
        }

        const trader = buyer as ITrade;
        const currency = trader.buy ? trader.currency : this._game.party.currency;
        const price = this.actualPrice(item, buyer, seller);
        return (price != undefined && currency != undefined && currency >= price) || price == 0;
    };

    actualPrice = (item: IItem, buyer: ITrade | ICharacter, seller: ITrade | ICharacter): number => {
        let resolvedModifier: number;
        const trader = buyer as ITrade;
        const modifier = trader.buy ? trader.sell?.priceModifier ?? (seller as ITrade).buy?.priceModifier : undefined;

        if (modifier == undefined) {
            resolvedModifier = 1;
        } else if (typeof modifier === 'function') {
            resolvedModifier = (<((game: IGame) => number)>modifier)(this._game)
        } else {
            resolvedModifier = modifier;
        }

        const members = <IItem[]>(item as IGroupableItem<IItem>).members;
        const values = members ? members.concat([item]).map(m => m.value) : [item.value];
        const totalValue = values.reduce((t, c) => t + c, 0);
        return Math.round(totalValue * resolvedModifier);
    }

    displayPrice = (item: IItem, actualPrice: number): string => actualPrice > 0 ? this._texts.format(this._texts.stockItemDisplayText, [this._itemService.getItemName(item), actualPrice.toString(), this._texts.currency]) : this._itemService.getItemName(item);

    buy = (item: IItem, trade: ITrade): boolean => {
        if (!this.canPay(item, this._game.activeCharacter, trade)) {
            return false;
        }

        const price = this.actualPrice(item, this._game.activeCharacter, trade);
        trade.currency += price;
        this._game.party.currency -= price;
        this._activeTrader.currency = trade.currency;
        trade.buy.items.delete(item);
        this._game.activeCharacter.items.add(item);

        if (trade.onBuy) {
            trade.onBuy(this._game, item);
        }

        return true;
    }

    sell = (item: IItem, trade: ITrade): boolean => {
        if (!this.canPay(item, trade, this._game.activeCharacter)) {
            return false;
        }

        const price = this.actualPrice(item, trade, this._game.activeCharacter);
        trade.currency -= price;
        this._game.party.currency += price;
        this._activeTrader.currency = trade.currency;
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
}