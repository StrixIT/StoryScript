namespace StoryScript {
    export class TradeController {
        constructor(private _scope: ng.IScope, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            self._scope.$on('init', () => self.init());
        }

        trade: ITrade;
        game: IGame;
        texts: IInterfaceTexts;

        canPay = (currency: number, value: number): boolean => {
            return (value != undefined && currency != undefined && currency >= value) || value == 0;
        }

        actualPrice = (item: IItem, modifier: number | (() => number)): number => {
            var self = this;
            modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(self.game) : modifier;
            return Math.round(item.value * <number>modifier);
        }

        displayPrice = (item: IItem, actualPrice: number): string => {
            var self = this;
            return actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + self.texts.currency) : item.name;
        }

        buy = (item: IItem, trade: ITrade): void => {
            var self = this;
            self.pay(item, trade, trade.buy, self.game.character, false);
            self.game.character.items.push(item);
            trade.buy.items.remove(item);

            if (trade.onBuy) {
                trade.onBuy(self.game, item);
            }
        }

        sell = (item: IItem, trade: ITrade): void => {
            var self = this;
            self.pay(item, trade, trade.sell, self.game.character, true);
            self.game.character.items.remove(item);
            trade.sell.items.remove(item);
            trade.buy.items.push(item);

            if (trade.onSell) {
                trade.onSell(self.game, item);
            }
        }

        private init(): void {
            var self = this;
            self.trade = self._game.currentLocation.activeTrade;
            var trader = self.trade;

            if (!trader) {
                return;
            }

            var itemsForSale = trader.buy.items;

            var buySelector = (item: IItem) => {
                return trader.buy.itemSelector(self.game, item);
            };

            if ((trader.initCollection && trader.initCollection(self.game, trader) || !itemsForSale)) {
                // Todo: change this when more than one trade per location is allowed.
                var collection = <any>(trader.ownItemsOnly ? self.game.currentLocation.activePerson.items : self.game.definitions.items);
                itemsForSale = StoryScript.randomList<IItem>(collection, trader.buy.maxItems, 'items', self.game.definitions, buySelector);
            }

            var sellSelector = (item: IItem) => {
                return trader.sell.itemSelector(self.game, item);
            };

            trader.buy.items = itemsForSale;
            trader.sell.items = StoryScript.randomList<IItem>(self.game.character.items, trader.sell.maxItems, 'items', self.game.definitions, sellSelector);
        }

        private pay(item: IItem, trader: ITrade, stock: IStock, character: ICharacter, characterSells: boolean): void {
            var self = this;

            var price = item.value;

            if (stock.priceModifier != undefined) {
                var modifier = typeof stock.priceModifier === 'function' ? (<any>stock).priceModifier(self.game) : stock.priceModifier;
                price = Math.round(item.value * modifier);
            }

            character.currency = character.currency || 0;
            character.currency = characterSells ? character.currency + price : character.currency - price;

            if (trader.currency != undefined) {
                trader.currency = characterSells ? trader.currency - price : trader.currency + price;
            }
        }
    }

    TradeController.$inject = ['$scope', 'game', 'customTexts'];
}