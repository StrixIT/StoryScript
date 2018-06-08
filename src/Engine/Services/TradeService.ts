namespace StoryScript {
    export interface ITradeService {
        initTrade(): ITrade;
        trade(trade: ICompiledPerson | ITrade): void;
        canPay(currency: number, value: number): boolean;
        actualPrice(item: IItem, modifier: number | (() => number)): number;
        displayPrice(item: IItem, actualPrice: number): string;
        buy(item: IItem, trade: ITrade): void;
        sell(item: IItem, trade: ITrade): void;
    }
}

namespace StoryScript {
    export class TradeService implements ITradeService {
        constructor(private _game: IGame, private _texts: IInterfaceTexts) {
        }

        trade = (trade: ICompiledPerson | ITrade): void => {
            var self = this;
            var isPerson = trade['type'] === 'person';

            self._game.currentLocation.activeTrade = isPerson ? (<ICompiledPerson>trade).trade : self._game.currentLocation.trade;
            var trader = self._game.currentLocation.activeTrade;

            if (isPerson) {
                trader.currency = (<ICompiledPerson>trade).currency;
                self._game.currentLocation.activePerson = <ICompiledPerson>trade;

                if (!trader.title) {
                    trader.title = self._texts.format(self._texts.trade, [(<ICompiledPerson>trade).name]);
                }
            }

            self._game.state = GameState.Trade;
        }

        initTrade = (): ITrade => {
            var self = this;

            var trader = self._game.currentLocation.activeTrade;

            if (!trader) {
                return null;
            }

            var itemsForSale = trader.buy.items;

            var buySelector = (item: IItem) => {
                return trader.buy.itemSelector(self._game, item);
            };

            if ((trader.initCollection && trader.initCollection(self._game, trader) || !itemsForSale)) {
                // Todo: change this when more than one trade per location is allowed.
                var collection = <any>(trader.ownItemsOnly ? self._game.currentLocation.activePerson.items : self._game.definitions.items);
                itemsForSale = StoryScript.randomList<IItem>(collection, trader.buy.maxItems, 'items', self._game.definitions, buySelector);
            }

            var sellSelector = (item: IItem) => {
                return trader.sell.itemSelector(self._game, item);
            };

            trader.buy.items = itemsForSale;
            trader.sell.items = StoryScript.randomList<IItem>(self._game.character.items, trader.sell.maxItems, 'items', self._game.definitions, sellSelector);

            return trader;
        }

        canPay = (currency: number, value: number): boolean => {
            return (value != undefined && currency != undefined && currency >= value) || value == 0;
        }

        actualPrice = (item: IItem, modifier: number | (() => number)): number => {
            var self = this;
            modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(self._game) : modifier;
            return Math.round(item.value * <number>modifier);
        }

        displayPrice = (item: IItem, actualPrice: number): string => {
            var self = this;
            return actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + self._texts.currency) : item.name;
        }

        // Todo: check if the player can affort it!
        buy = (item: IItem, trade: ITrade): void => {
            var self = this;
            self.pay(item, trade, trade.buy, self._game.character, false);
            self._game.character.items.push(item);
            trade.buy.items.remove(item);

            if (trade.onBuy) {
                trade.onBuy(self._game, item);
            }
        }

        // Todo: check if the trader can affort it!
        sell = (item: IItem, trade: ITrade): void => {
            var self = this;
            self.pay(item, trade, trade.sell, self._game.character, true);
            self._game.character.items.remove(item);
            trade.sell.items.remove(item);
            trade.buy.items.push(item);

            if (trade.onSell) {
                trade.onSell(self._game, item);
            }
        }

        private pay(item: IItem, trader: ITrade, stock: IStock, character: ICharacter, characterSells: boolean): void {
            var self = this;

            var price = item.value;

            if (stock.priceModifier != undefined) {
                var modifier = typeof stock.priceModifier === 'function' ? (<any>stock).priceModifier(self._game) : stock.priceModifier;
                price = Math.round(item.value * modifier);
            }

            character.currency = character.currency || 0;
            character.currency = characterSells ? character.currency + price : character.currency - price;

            if (trader.currency != undefined) {
                trader.currency = characterSells ? trader.currency - price : trader.currency + price;
            }
        }
    }
}