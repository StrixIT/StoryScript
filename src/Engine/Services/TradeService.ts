namespace StoryScript {
    export interface ITradeService {
        initTrade(): ITrade;
        trade(trade: IPerson | ITrade): void;
        canPay(currency: number, value: number): boolean;
        actualPrice(item: IItem, modifier: number | (() => number)): number;
        displayPrice(item: IItem, actualPrice: number): string;
        buy(item: IItem, trade: ITrade): boolean;
        sell(item: IItem, trade: ITrade): boolean;
    }
}

namespace StoryScript {
    export class TradeService implements ITradeService {
        constructor(private _game: IGame, private _texts: IInterfaceTexts) {
        }

        trade = (trade: IPerson | ITrade): void => {
            var isPerson = trade && trade['type'] === 'person';

            this._game.currentLocation.activeTrade = isPerson ? (<IPerson>trade).trade : this._game.currentLocation.trade;
            var trader = this._game.currentLocation.activeTrade;

            if (isPerson) {
                trader.currency = (<IPerson>trade).currency;
                this._game.currentLocation.activePerson = <IPerson>trade;

                if (!trader.title) {
                    trader.title = this._texts.format(this._texts.trade, [(<IPerson>trade).name]);
                }
            }

            this._game.playState = PlayState.Trade;
        }

        initTrade = (): ITrade => {
            var trader = this._game.currentLocation && this._game.currentLocation.activeTrade;

            if (!trader) {
                return null;
            }

            var itemsForSale = trader.buy.items ? trader.buy.items.slice() : undefined;

            var buySelector = (item: IItem) => {
                return trader.buy.itemSelector(this._game, item);
            };

            if ((trader.initCollection && trader.initCollection(this._game, trader) || !itemsForSale)) {
                // Change this when more than one trade per location is allowed.
                var collection = <any>(trader.ownItemsOnly ? this._game.currentLocation.activePerson.items : this._game.definitions.items);
                itemsForSale = StoryScript.randomList<IItem>(collection, trader.buy.maxItems, 'items', this._game.definitions, buySelector);
            }

            var sellSelector = (item: IItem) => {
                return trader.sell.itemSelector(this._game, item);
            };

            var itemsToSell = StoryScript.randomList<IItem>(this._game.character.items, trader.sell.maxItems, 'items', this._game.definitions, sellSelector);

            if (!trader.buy.items) {
                trader.buy.items = [];
            }

            trader.buy.items.length = 0;
            itemsForSale.forEach(i => trader.buy.items.push(i));

            if (!trader.sell.items) {
                trader.sell.items = [];
            }

            trader.sell.items.length = 0;
            itemsToSell.forEach(i => trader.sell.items.push(i));

            return trader;
        }

        canPay = (currency: number, value: number): boolean => (value != undefined && currency != undefined && currency >= value) || value == 0;

        actualPrice = (item: IItem, modifier: number | (() => number)): number => {
            modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(this._game) : modifier;
            return Math.round(item.value * <number>modifier);
        }

        displayPrice = (item: IItem, actualPrice: number): string => actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + this._texts.currency) : item.name;

        buy = (item: IItem, trade: ITrade): boolean => {
            if (!this.pay(item, trade, trade.buy, this._game.character, false)) {
                return false;
            }

            this._game.character.items.push(item);
            trade.buy.items.remove(item);

            if (trade.onBuy) {
                trade.onBuy(this._game, item);
            }

            return true;
        }

        sell = (item: IItem, trade: ITrade): boolean => {
            if (!this.pay(item, trade, trade.sell, this._game.character, true)) {
                return false;
            };

            this._game.character.items.remove(item);
            trade.sell.items.remove(item);
            trade.buy.items.push(item);

            if (trade.onSell) {
                trade.onSell(this._game, item);
            }

            return true;
        }

        private pay = (item: IItem, trader: ITrade, stock: IStock, character: ICharacter, characterSells: boolean): boolean => {
            var price = item.value;

            if (stock.priceModifier != undefined) {
                var modifier = typeof stock.priceModifier === 'function' ? (<any>stock).priceModifier(this._game) : stock.priceModifier;
                price = Math.round(item.value * modifier);
            }

            character.currency = character.currency || 0;
            trader.currency = trader.currency || 0;

            var canAffort = characterSells ? trader.currency - price >= 0 : character.currency - price >= 0;

            if (canAffort) {
                character.currency = characterSells ? character.currency + price : character.currency - price;

                if (trader.currency != undefined) {
                    trader.currency = characterSells ? trader.currency - price : trader.currency + price;
                }

                if (this._game.currentLocation.activePerson && this._game.currentLocation.activePerson.trade === this._game.currentLocation.activeTrade) {
                    this._game.currentLocation.activePerson.currency = this._game.currentLocation.activeTrade.currency;
                }

            }

            return canAffort;
        }
    }
}