describe("TradeService", function() {

    it("should start trade with an entity that is not a person", function() {
        var game = {
            currentLocation: {
                trade: {}
            }
        }
        var service = getService(game);

        service.trade();

        expect(game.state).toBe(StoryScript.GameState.Trade);
    });
    
    it("should start trade with a person", function() {
        var game = {
            currentLocation: {}
        }

        var texts = {
            format: function(format, tokens) { return tokens[0]; }
        }

        var trader = {
            type: 'person',
            name: 'Jack',
            currency: 10,
            trade: {},
        }

        var service = getService(game, texts);

        service.trade(trader);
        var activeTrade = game.trade;

        expect(activeTrade).toBe(trader.trade);
        expect(game.person).toBe(trader);
        expect(activeTrade.currency).toBe(trader.trade.currency);
        expect(activeTrade.title).toBe(trader.name);
        expect(game.state).toBe(StoryScript.GameState.Trade);
    });

    function getService(game, texts) {
        return new StoryScript.TradeService(game || {}, texts || {});
    }
});