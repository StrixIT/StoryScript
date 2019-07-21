describe("ObjectFactory", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    it("should create the Start location", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var definition = game.definitions.locations.find(l => l.name === 'Start');
        var result = definition();

        expect(result).not.toEqual(null);
        expect(result.id).toEqual('start');
        expect(result.type).toEqual('locations');
        expect(result.descriptionSelector.functionId).toEqual('function#location_start_descriptionSelector#430859754');
    });

    it("should create a location with read-only properties", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var definition = game.definitions.locations.find(l => l.name === 'Start');
        var result = definition();

        expect(result.activeItems.length).toEqual(0);

        // Add an item to activeItems to see whether the array is read-only indeed.
        result.items.push({});
        expect(result.activeItems.length).toEqual(1);
        result.activeItems = [];
        expect(result.activeItems.length).toEqual(1);
    });

    it("should create a location with arrays that cannot be replaced and execute functions on push", function() {
        var game = StoryScript.ObjectFactory.GetGame();
        var definition = game.definitions.locations.find(l => l.name === 'Start');
        var result = definition();

        // Check that the items array cannot be replaced.
        expect(function() {
            result.items = [];
        }).toThrow();

        // Add an item definition to the items array, and check that the function was executed.
        var swordDef = game.definitions.items.find(l => l.name === 'Sword');
        result.items.push(swordDef);
        var pushedItem = result.items[0];
        expect(typeof pushedItem).toBe('object');
    });

    it("should instantiate keys on destination barriers", function() {
        var functions = StoryScript.ObjectFactory.GetFunctions();

        function Key() {
            return {
                name: 'Test key'
            };
        };

        function locationWithBarrier() {
            return StoryScript.Location({
                name: 'Test location',
                destinations: [
                    {
                        name: 'Test barrier',
                        barrier: {
                            name: 'Door',
                            key: Key,
                            actions: [
                                {
                                    name: 'Inspect',
                                    action: () => {}
                                },
                            ]
                        }
                    }
                ]
            });
        };
        
        var result = locationWithBarrier();
        var key = result.destinations[0].barrier.key;
        expect(typeof key).toBe('object');
        expect(key.name).toBe('Test key');

        // Clean up the function definitions added creating this location.
        var keysToRemove = Object.keys(functions.locations);
        delete functions.locations[keysToRemove.pop()];
        delete functions.locations[keysToRemove.pop()];
    });
});