import {beforeAll, describe, expect, test} from 'vitest';
import {
    EquipmentType,
    Feature,
    IAction,
    IBarrier,
    ICompiledLocation,
    IFeature,
    IKey,
    ILocation,
    Location,
} from 'storyScript/Interfaces/storyScript';
import {Start} from "../../../Games/MyRolePlayingGame/locations/start.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";
import {Bandit} from "../../../Games/MyRolePlayingGame/enemies/bandit.ts";
import {customEntity, DynamicEntity, InitEntityCollection} from "storyScript/EntityCreatorFunctions.ts";
import {LeatherBoots} from "../../../Games/MyRolePlayingGame/items/leatherBoots.ts";
import {Friend} from "../../../Games/MyRolePlayingGame/persons/Friend.ts";
import {Item} from "../../../Games/MyRolePlayingGame/interfaces/item.ts";
import {initServiceFactory} from "../helpers.ts";

describe("EntityCreatorFunctions", function () {

    beforeAll(() => {
        initServiceFactory();
    });

    test("should create the Start location with read-only properties", function () {
        const start = <ICompiledLocation>Start();
        expect(start).not.toEqual(null);
        expect(start.id).toEqual('start');
        expect((<any>start).type).toEqual('location');

        // Check that the items array is present and that it cannot be replaced.
        expect(function () {
            start.items = [];
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
                        barriers: [['Barrier', <IBarrier>{
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
                        }]]
                    }
                ]
            });
        }

        const result = locationWithBarrier();
        const key = result.destinations[0].barriers[0][1].key;
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


    test("should correctly create a dynamic entity", function () {
        const dynamicItem = function Lamp() {
            return Item({
                name: 'Magic Lamp',
                equipmentType: EquipmentType.Miscellaneous,
                value: 10
            })
        };

        const lamp = DynamicEntity(dynamicItem);
        expect(lamp).not.toBeNull();
        expect(lamp.id).toBe('lamp');
        expect((<any>lamp).type).toBe('item');
        expect(lamp.value).toBe(10);
    });

    test("should use the specified id when creating a dynamic entity", function () {
        const dynamicItem = function Archway() {
            return Feature({
                name: 'Magic Lamp'
            })
        };

        const lamp = DynamicEntity(dynamicItem, 'gate');
        expect(lamp).not.toBeNull();
        expect(lamp.id).toBe('gate');
    });

    test("should throw an error when creating a dynamic entity with an anonymous function and no id", function () {
        expect(() => {
            DynamicEntity(() => Feature({name: 'Magic Lamp'}));
        }).toThrow();
    });

    test("should throw when creating a custom entity without a name", function () {
        expect(function () {
            customEntity(Bandit, {name: '', hitpoints: 15});
        }).toThrow();
    });

    test("should correctly create a custom entity", function () {
        const name = 'Jack';
        const boots = LeatherBoots();
        const emptyText = 'I\'ve nothing left';
        const result = customEntity(Friend, {name: name, items: [boots], trade: {buy: {emptyText: emptyText}}});
        expect(result).not.toBeNull();
        expect(result.id).toBe(name.toLowerCase());
        expect(result.items.length).toBe(2);
        expect(result.items[1]).toEqual(boots);
        expect(result.trade.buy.emptyText).toBe(emptyText);
    });

    test("should not init unknown collections", function () {
        const entity = {
            unknown: undefined
        }

        InitEntityCollection(entity, 'unknown');
        expect(entity.unknown).toBeUndefined();
    });
});