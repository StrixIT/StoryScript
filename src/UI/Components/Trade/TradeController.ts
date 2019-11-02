namespace StoryScript {
    export class TradeController {
        constructor(private _tradeService: ITradeService, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        canPay = (currency: number, value: number): boolean => this._tradeService.canPay(currency, value);

        actualPrice = (item: IItem, modifier: number | (() => number)): number => this._tradeService.actualPrice(item, modifier);

        displayPrice = (item: IItem, actualPrice: number): string  => this._tradeService.displayPrice(item, actualPrice);

        buy = (item: IItem, trade: ITrade): boolean => this._tradeService.buy(item, trade);
        
        sell = (item: IItem, trade: ITrade): boolean => this._tradeService.sell(item, trade);
    }

    TradeController.$inject = ['tradeService', 'game', 'customTexts'];
}