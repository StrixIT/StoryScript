/**
 * @vitest-environment jsdom
 */
import {beforeAll, describe, expect, test} from 'vitest';
import {
    Feature,
    IAction,
    IBarrier,
    ICompiledLocation,
    IFeature, IGame,
    IKey,
    ILocation,
    Location,
} from 'storyScript/Interfaces/storyScript';
import {ServiceFactory} from 'storyScript/ServiceFactory.ts';
import {RunGame} from '../../../Games/MyRolePlayingGame/run';
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";
import {parseGamePropertiesInTemplate} from "storyScript/EntityCreatorFunctions.ts";

describe("EntityCreatorFunctions", function () {

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

    test("game property should be parsed in string", function () {
        const value = "Hi there, {game.activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{ activeCharacter: { name: 'John'}});

        expect(expected).toEqual(actual);
    });

    test("game property should be parsed in string when game part is not included", function () {
        const value = "Hi there, {activeCharacter.name}!";
        const expected = "Hi there, John!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{ activeCharacter: { name: 'John'}});

        expect(expected).toEqual(actual);
    });

    test("game property with index should be parsed in string", function () {
        const value = "Hi there. That's a nice {game.activeCharacter.items[0].name}!";
        const expected = "Hi there. That's a nice Sword!";
        const actual = parseGamePropertiesInTemplate(value, <IGame>{ activeCharacter: { items: [ { name: 'Sword' }]}});

        expect(expected).toEqual(actual);
    });

    test("unknown property should not be parsed in string", function () {
        const value = "Hi there {game.activeCharacter.dummy}!";
        const expected = value;
        const actual = parseGamePropertiesInTemplate(value, <IGame>{ activeCharacter: { items: [ { name: 'Sword' }]}});

        expect(expected).toEqual(actual);
    });
    
});