module StoryScript {
    export interface ITradeControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        trade: ITrade;
    }

    export class TradeController {
        private $scope: ITradeControllerScope;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: ITradeControllerScope, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.game = game;
            self.texts = texts;
            self.$scope.game = self.game;
            self.$scope.texts = self.texts;
            self.$scope.trade = self.game.currentLocation.activeTrade;
            self.init();
        }

        init = () => {
            var self = this;
            var trader = self.$scope.trade;

            var itemsForSale = trader.buy.items;

            var buySelector = (item: IItem) => {
                return trader.buy.itemSelector(self.game, item);
            };

            if ((trader.initCollection && trader.initCollection(self.game, trader) || !itemsForSale)) {
                itemsForSale = StoryScript.randomList<IItem>(self.game.definitions.items, trader.buy.maxItems, buySelector);
            }

            var sellSelector = (item: IItem) => {
                return trader.sell.itemSelector(self.game, item);
            };

            trader.buy.items = itemsForSale;
            trader.sell.items = StoryScript.randomList<IItem>(self.game.character.items, trader.sell.maxItems, sellSelector);
        }

        canPay = (currency: number, value: number) => {
            return (value != undefined && currency != undefined && currency >= value) || value == 0;
        }

        actualPrice = (item: IItem, modifier: number | (() => number)) => {
            var self = this;
            modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(self.game) : modifier;
            return Math.round(item.value * <number>modifier);
        }

        displayPrice = (item: IItem, actualPrice: number) => {
            var self = this;
            return actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + self.texts.currency) : item.name;
        }

        buy = (item: IItem, trade: ITrade) => {
            var self = this;
            self.pay(item, trade, trade.buy, self.game.character, false);
            self.game.character.items.push(item);
            trade.buy.items.remove(item);
        }

        sell = (item: IItem, trade: ITrade) => {
            var self = this;
            self.pay(item, trade, trade.sell, self.game.character, true);
            self.game.character.items.remove(item);
            trade.sell.items.remove(item);
            trade.buy.items.push(item);
        }

        private pay(item: IItem, trader: ITrade, stock: IStock, character: ICharacter, characterSells: boolean) {
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