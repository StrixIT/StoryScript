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

            var itemsForSale = trader.sell.items;

            if (!itemsForSale) {
                itemsForSale = StoryScript.randomList<IItem>(self.game.definitions.items, trader.sell.maxItems, trader.sell.itemSelector);
            }

            trader.sell.items = itemsForSale;
            trader.buy.items = StoryScript.randomList<IItem>(self.game.character.items, trader.buy.maxItems, trader.buy.itemSelector);
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
            var price = item.value;

            if (trade.buy.priceModifier != undefined) {
                var modifier = typeof trade.buy.priceModifier === 'function' ? (<any>trade.buy).priceModifier(self.game) : trade.buy.priceModifier;
                price = Math.round(item.value * modifier);
            }

            self.game.character.currency = self.game.character.currency || 0;
            self.game.character.currency -= price;

            self.game.character.items.push(item);

            if (trade.currency != undefined) {
                trade.currency += price;
            }

            trade.sell.items.remove(item);
        }

        sell = (item: IItem, trade: ITrade) => {
            var self = this;
            var price = item.value;

            if (trade.sell.priceModifier != undefined) {
                var modifier = typeof trade.sell.priceModifier === 'function' ? (<any>trade.sell).priceModifier(self.game) : trade.sell.priceModifier;
                price = Math.round(item.value * modifier);
            }

            self.game.character.currency = self.game.character.currency || 0;
            self.game.character.currency += price;

            self.game.character.items.remove(item);
            trade.buy.items.remove(item);

            if (trade.currency != undefined) {
                trade.currency -= price;
            }

            trade.sell.items.push(item);
        }
    }

    TradeController.$inject = ['$scope', 'game', 'customTexts'];
}