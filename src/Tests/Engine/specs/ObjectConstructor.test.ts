import { describe, beforeAll, test, expect } from 'vitest';
import { GetDefinitions, GetFunctions, DynamicEntity, FunctionCollection } from 'storyScript/ObjectConstructors';
import { Location, ILocation, IBarrier, IKey, IAction, IFeature, Feature, ICompiledLocation, IItem } from 'storyScript/Interfaces/storyScript';
import { ObjectFactory } from 'storyScript/ObjectFactory';
import { RunGame } from '../../../Games/MyRolePlayingGame/run';

describe("ObjectConstructors", function() {

    beforeAll(() => {
        RunGame();
    });

    test("should get the game definitions", function() {
        const result = <any>GetDefinitions();
        expect(result).not.toEqual(null);
        expect(result.locations.length).toEqual(5);
        expect(result.items.length).toEqual(4);
        expect(result.enemies.length).toEqual(1);
        expect(result.persons.length).toEqual(1);
        expect(result.quests.length).toEqual(1);
        expect(result.actions.length).toEqual(0);
    });

    test("should get the game functions", function() {
        const result = <FunctionCollection>GetFunctions();
        expect(result).not.toEqual(null);
        expect(getLength(result.locations)).toEqual(8);
        expect(getLength(result.items)).toEqual(1);
        expect(getLength(result.quests)).toEqual(4);
        expect(getLength(result.persons)).toEqual(3);

        expect(result.features).toBeUndefined();
        expect(result.enemies).toBeUndefined();
        expect(result.actions).toBeUndefined();

        const locationFunctions = Object.keys(result.locations).sort().map(k => `${k}:${result.locations[k].hash}`);

        expect(locationFunctions).toEqual([
            "bedroom|trade|0|buy|itemSelector:-757288170",
            "bedroom|trade|0|sell|itemSelector:-757288170",
            "bedroom|trade|0|sell|priceModifier:-1683809711",
            "dirtroad|combatActions|0|execute:-34161269",
            "garden|actions|0|execute:416420323",
            "garden|actions|1|execute:1867314870",
            "garden|enterEvents|0|Squirrel:-1552061099",
            "start|descriptionSelector:1949117004"]);
    });

    test("should create the Start location", function() {
        const definitions = GetDefinitions()
        const definition = find(definitions.locations, 'Start');
        const result = <ICompiledLocation>definition();

        expect(result).not.toEqual(null);
        expect(result.id).toEqual('start');
        expect((<any>result).type).toEqual('location');

        const hashMatch = new RegExp(/function#location|start|descriptionSelector#[0-9]{9}/g).exec((<any>result.descriptionSelector).functionId).length;

        expect(hashMatch).toEqual(1);
    });

    test("should create a location with read-only properties", function() {
        const definitions = GetDefinitions()
        const definition = find(definitions.locations, 'Start');
        const result = <ICompiledLocation>definition();

        expect(result.activeItems.length).toEqual(0);

        // Add an item to activeItems to see whether the array is read-only indeed.
        result.items.push(<IItem>{});
        expect(result.activeItems.length).toEqual(1);

        expect(function() {
            result.activeItems = [];
        }).toThrow();
    });

    test("should create a location with arrays that cannot be replaced and execute functions on add", function() {
        const definitions = GetDefinitions()
        const definition = find(definitions.locations, 'Start');
        const result = definition();

        // Check that the items array cannot be replaced.
        expect(function() {
            result.items = [];
        }).toThrow();

        // Add an item definition to the items array, and check that the function was executed.
        const swordDef = find(definitions.items, 'Sword');
        result.items.add(swordDef);
        const addedItem = result.items[0];
        expect(typeof addedItem).toBe('object');
    });

    test("should set key id on destination barriers", function() {

        function Key() {
            return <IKey>{
                name: 'Test key'
            };
        };

        function locationWithBarrier() {
            return Location(<ILocation>{
                name: 'Test location',
                destinations: [
                    {
                        name: 'Test barrier',
                        barrier: <IBarrier>{
                            name: 'Door',
                            key: Key,
                            actions: [
                                <IAction>{
                                    name: 'Inspect',
                                    execute: () => {}
                                },
                            ]
                        }
                    }
                ]
            });
        };
        
        const result = locationWithBarrier();
        const key = result.destinations[0].barrier.key;
        expect(typeof key).toBe('string');
        expect(key).toBe('key');
    });

    test("should correctly create a feature", function() {
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
    
    test("should return all services", function() {
        const factory = ObjectFactory.GetInstance();

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

function getLength(collection: {}) {
    return Object.keys(collection).length;
}

function find<T>(collection: (() => T)[], name: string) {
    return collection.find(l => l.name === name);
}