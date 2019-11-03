export class TradeController {
    constructor(private _tradeService: StoryScript.ITradeService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    canPay = (currency: number, value: number): boolean => this._tradeService.canPay(currency, value);

    actualPrice = (item: StoryScript.IItem, modifier: number | (() => number)): number => this._tradeService.actualPrice(item, modifier);

    displayPrice = (item: StoryScript.IItem, actualPrice: number): string  => this._tradeService.displayPrice(item, actualPrice);

    buy = (item: StoryScript.IItem, trade: StoryScript.ITrade): boolean => this._tradeService.buy(item, trade);
    
    sell = (item: StoryScript.IItem, trade: StoryScript.ITrade): boolean => this._tradeService.sell(item, trade);
}

TradeController.$inject = ['tradeService', 'game', 'customTexts'];