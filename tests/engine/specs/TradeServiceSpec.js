describe("TradeService", function() {

    it("should start trade with an entity that is not a person", function() {
        var game = game || StoryScript.ObjectFactory.GetGame();

        var trade = {
            buy: {
                maxItems: 3,
                items: []
            },
            sell: {
                maxItems: 3,
                items: []
            }
        };

        game.currentLocation = {
            trade: trade
        };

        var service = getService(game);
        service.trade(trade);
        expect(game.state).toBe(StoryScript.GameState.Trade);
    });
    
    it("should start trade with a person", function() {
        var game = StoryScript.ObjectFactory.GetGame();

        var texts = {
            format: function(format, tokens) { return tokens[0]; }
        }

        var trader = {
            type: 'person',
            name: 'Jack',
            currency: 10,
            trade: {
                buy: {
                    maxItems: 3,
                    itemSelector: function() {
                        return true;
                    }
                },
                sell: {
                    maxItems: 3,
                    sellSelector: function() {
                        return true;
                    }
                }
            },
        }

        var service = getService(game, texts, trader);

        service.trade(trader);
        var activeTrade = game.trade;

        expect(activeTrade).toBe(trader.trade);
        expect(game.person).toBe(trader);
        expect(activeTrade.currency).toBe(trader.trade.currency);
        expect(activeTrade.title).toBe(trader.name);
        expect(game.state).toBe(StoryScript.GameState.Trade);
    });

    function getService(game, texts, trader) {
        game.character = game.character || {
            items: []
        };

        return new StoryScript.TradeService(game, texts || {});
    }
});