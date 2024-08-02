import {beforeAll, describe, expect, test} from 'vitest';
import {
    Feature,
    IAction,
    IBarrier,
    ICompiledLocation,
    IFeature,
    IKey,
    ILocation,
    Location,
} from 'storyScript/Interfaces/storyScript';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {RunGame} from '../../../Games/MyRolePlayingGame/run';
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";

describe("ObjectConstructors", function () {

    beforeAll(() => {
        RunGame();
    });

    test("should create the Start location with read-only properties", function () {
        const start = <ICompiledLocation>Start();
        expect(start).not.toEqual(null);
        expect(start.id).toEqual('start');
        expect((<any>start).type).toEqual('location');

        expect(start.activeItems.length).toEqual(0);

        // Check that the activeItems array is present and 
        // both it and the items array cannot be replaced.
        expect(function () {
            start.items = [];
        }).toThrow();

        expect(function () {
            start.activeItems = [];
        }).toThrow();

        // Add an item definition to the items array, and check that the function was executed.
        start.items.add(Sword);
        const addedItem = start.items[0];
        expect(typeof addedItem).toBe('object');
    });

    test("should set key id on destination barriers", function () {

        function Key() {
            return <IKey>{
                name: 'Test key'
            };
        }

        function locationWithBarrier() {
            return Location(<ILocation>{
                name: 'Test location',
                destinations: [
                    {
                        name: 'Test barrier',
                        barrier: <IBarrier>{
                            name: 'Door',
                            key: Key,
                            actions: [[
                                'Inspect',
                                <IAction>{
                                    name: 'Inspect',
                                    execute: () => {
                                    }
                                }
                            ]]
                        }
                    }
                ]
            });
        }

        const result = locationWithBarrier();
        const key = result.destinations[0].barrier.key;
        expect(typeof key).toBe('string');
        expect(key).toBe('key');
    });

    test("should correctly create a feature", function () {
        const testFeature = () => {
            return <IFeature>{
                name: 'Test feature'
            }
        }

        const result = Feature(testFeature);
        expect(result).not.toBeNull();
        expect(result.id).toBe('testfeature');
        expect((<any>result).type).toBe('feature');
    });

});

describe('ObjectFactory', function () {

    test("should return all services", function () {
        const factory = ServiceFactory.GetInstance();

        let characterService = factory.GetCharacterService();
        expect(characterService).not.toBeNull();

        const combinationService = factory.GetCombinationService();
        expect(combinationService).not.toBeNull();

        const conversationService = factory.GetConversationService();
        expect(conversationService).not.toBeNull();

        const gameService = factory.GetGameService();
        expect(gameService).not.toBeNull();

        const tradeService = factory.GetTradeService();
        expect(tradeService).not.toBeNull();

        const texts = factory.GetTexts();
        expect(texts).not.toBeNull();

        const rules = factory.GetRules();
        expect(rules).not.toBeNull();
    });
})