import { GetDefinitions, GetFunctions, buildEntities } from 'storyScript/ObjectConstructors';
import { Location, ILocation, IBarrier, IKey, IAction } from 'storyScript/Interfaces/storyScript';
import '../../../Games/MyRolePlayingGame/run';

describe("ObjectFactory", function() {

    it("should get the game definitions", function() {
        var result = <any>GetDefinitions();
        expect(result).not.toEqual(null);
        expect(result.locations.length).toEqual(5);
        expect(result.items.length).toEqual(4);
        expect(result.enemies.length).toEqual(1);
        expect(result.persons.length).toEqual(1);
        expect(result.quests.length).toEqual(1);
        expect(result.actions.length).toEqual(0);
    });

    it("should get the game functions", function() {
        // First, build all entities once so the functions are registered.
        buildEntities();
        var result = <any>GetFunctions();

        expect(result).not.toEqual(null);
        expect(getLength(result.locations)).toEqual(8);
        expect(getLength(result.items)).toEqual(1);
        expect(getLength(result.quests)).toEqual(4);
        expect(getLength(result.persons)).toEqual(3);

        expect(result.features).toBeUndefined();
        expect(result.enemies).toBeUndefined();
        expect(result.actions).toBeUndefined();

        var locationFunctions = Object.keys(result.locations).sort().map(k => `${k}:${result.locations[k].hash}`);

        expect(locationFunctions).toEqual([
            "bedroom|trade|0|buy|itemSelector:-589556356",
            "bedroom|trade|0|sell|itemSelector:-589556356",
            "bedroom|trade|0|sell|priceModifier:700782575",
            "dirtroad|combatActions|0|execute:1245674738",
            "garden|actions|0|execute:-452619560",
            "garden|actions|1|execute:131026483",
            "garden|enterEvents|0:-1677062687",
            "start|descriptionSelector:283150339"]);
    });

    it("should create the Start location", function() {
        var definitions = GetDefinitions()
        var definition = find(definitions.locations, 'Start');
        var result = definition();

        expect(result).not.toEqual(null);
        expect(result.id).toEqual('start');
        expect(result.type).toEqual('location');

        var hashMatch = new RegExp(/function#location|start|descriptionSelector#[0-9]{9}/g).exec(result.descriptionSelector.functionId).length;

        expect(hashMatch).toEqual(1);
    });

    it("should create a location with read-only properties", function() {
        var definitions = GetDefinitions()
        var definition = find(definitions.locations, 'Start');
        var result = definition();

        expect(result.activeItems.length).toEqual(0);

        // Add an item to activeItems to see whether the array is read-only indeed.
        result.items.push({});
        expect(result.activeItems.length).toEqual(1);

        expect(function() {
            result.activeItems = [];
        }).toThrow();
    });

    it("should create a location with arrays that cannot be replaced and execute functions on push", function() {
        var definitions = GetDefinitions()
        var definition = find(definitions.locations, 'Start');
        var result = definition();

        // Check that the items array cannot be replaced.
        expect(function() {
            result.items = [];
        }).toThrow();

        // Add an item definition to the items array, and check that the function was executed.
        var swordDef = find(definitions.items, 'Sword');
        result.items.push(swordDef);
        var pushedItem = result.items[0];
        expect(typeof pushedItem).toBe('object');
    });

    it("should set key id on destination barriers", function() {
        var functions = <any>GetFunctions();

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
        
        var result = locationWithBarrier();
        var key = result.destinations[0].barrier.key;
        expect(typeof key).toBe('string');
        expect(key).toBe('Key');
    });

    function getLength(collection) {
        return Object.keys(collection).length;
    }

    function find(collection, name) {
        return collection.find(l => l.name === name);
    }
});