import { describe, test, expect } from 'vitest';
import { TradeService } from 'storyScript/Services/TradeService';
import { ITrade, ICompiledLocation, IPerson, PlayState, IGame, ICharacter } from 'storyScript/Interfaces/storyScript';
import { IStock } from 'storyScript/Interfaces/stock';

describe("TradeService", function() {

    test("should start trade with an entity that is not a person", function() {
        var game = <IGame>{
            activeCharacter: {
                items: []
            },
        };

        var trade = [<ITrade>{
            buy: {
                maxItems: 3,
                items: []
            },
            sell: {
                maxItems: 3,
                items: []
            }
        }];

        game.currentLocation = <ICompiledLocation>{
            trade: trade
        };

        var service = getService(game);
        service.trade(trade[0]);
        expect(game.playState).toBe(PlayState.Trade);
    });
    
    test("should start trade with a person", function() {
        var game = <IGame>{
            activeCharacter: {
                items: []
            },
            definitions: {
                items: []
            }
        };

        var texts = {
            format: function(format, tokens) { return tokens[0]; }
        }

        var trader = <IPerson>{
            type: 'person',
            name: 'Jack',
            currency: 10,
            hitpoints: 0,
            trade: <ITrade>{
                buy: <IStock>{
                    text: '',
                    emptyText: '',
                    maxItems: 3,
                    itemSelector: function() {
                        return true;
                    }
                },
                sell: <IStock>{
                    text: '',
                    emptyText: '',
                    maxItems: 3,
                    sellSelector: function() {
                        return true;
                    }
                }
            },
        }

        game.currentLocation = <ICompiledLocation>{
            persons: [trader]
        };

        var service = getService(game, texts);

        service.trade(trader);
        var activeTrade = game.trade;

        expect(activeTrade).toBe(trader.trade);
        expect(game.person).toBe(trader);
        expect(activeTrade.currency).toBe(trader.trade.currency);
        expect(activeTrade.name).toBe(trader.name);
        expect(game.playState).toBe(PlayState.Trade);
    });

});

function getService(game: IGame, texts?) {
    game.activeCharacter = game.activeCharacter || <ICharacter>{
        items: []
    };

    return new TradeService(game, texts || {});
}