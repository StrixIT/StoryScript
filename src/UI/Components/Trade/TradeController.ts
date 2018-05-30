namespace StoryScript {
    export class TradeController {
        constructor(private _scope: ng.IScope, private _tradeService: ITradeService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            self._scope.$on('init', () => self.trade = self._tradeService.initTrade());
        }

        trade: ITrade;
        game: IGame;
        texts: IInterfaceTexts;

        canPay = (currency: number, value: number): boolean => {
            var self = this;
            return self._tradeService.canPay(currency, value);
        }

        actualPrice = (item: IItem, modifier: number | (() => number)): number => {
            var self = this;
            return self._tradeService.actualPrice(item, modifier);
        }

        displayPrice = (item: IItem, actualPrice: number): string  => {
            var self = this;
            return self._tradeService.displayPrice(item, actualPrice);
        }
        buy = (item: IItem, trade: ITrade): void => {
            var self = this;
            self._tradeService.buy(item, trade);
        }
        sell = (item: IItem, trade: ITrade): void => {
            var self = this;
            self._tradeService.sell(item, trade);
        }
    }

    TradeController.$inject = ['$scope', 'tradeService', 'game', 'customTexts'];
}