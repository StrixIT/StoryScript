import {describe, expect, test} from 'vitest';
import {TradeService} from 'storyScript/Services/TradeService';
import {
    ICharacter,
    ICompiledLocation,
    IDefinitions,
    IGame,
    IPerson,
    IRules,
    ITrade,
    PlayState
} from 'storyScript/Interfaces/storyScript';
import {IStock} from 'storyScript/Interfaces/stock';
import {IItemService} from "storyScript/Interfaces/services/itemService.ts";

describe("TradeService", function () {

    test("should start trade with an entity that is not a person", function () {
        const game = <IGame>{
            activeCharacter: {
                items: []
            },
        };

        const trade = [<ITrade>{
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

        const service = getService(<IItemService>{}, game);
        service.trade(trade[0]);
        expect(game.playState).toBe(PlayState.Trade);
    });

    test("should start trade with a person", function () {
        const game = <IGame>{
            activeCharacter: {
                items: []
            }
        };

        const texts = {
            format: function (format, tokens) {
                return tokens[0];
            }
        }

        const trader = <IPerson>{
            type: 'person',
            name: 'Jack',
            currency: 10,
            hitpoints: 0,
            trade: <ITrade>{
                buy: <IStock>{
                    text: '',
                    emptyText: '',
                    maxItems: 3,
                    itemSelector: function () {
                        return true;
                    }
                },
                sell: <IStock>{
                    text: '',
                    emptyText: '',
                    maxItems: 3,
                    sellSelector: function () {
                        return true;
                    }
                }
            },
        }

        game.currentLocation = <ICompiledLocation>{
            persons: [trader]
        };

        const service = getService(<IItemService>{}, game, undefined, texts, <IDefinitions>{items: []});

        service.trade(trader);
        const activeTrade = game.trade;

        expect(activeTrade).toBe(trader.trade);
        expect(game.person).toBe(trader);
        expect(activeTrade.currency).toBe(trader.trade.currency);
        expect(activeTrade.name).toBe(trader.name);
        expect(game.playState).toBe(PlayState.Trade);
    });

});

function getService(itemService: IItemService, game: IGame, rules?: IRules, texts?, definitions?: IDefinitions) {
    game.activeCharacter = game.activeCharacter || <ICharacter>{
        items: []
    };

    return new TradeService(itemService || <IItemService>{}, game, rules || <IRules>{}, texts || {}, definitions ?? <IDefinitions>{});
}