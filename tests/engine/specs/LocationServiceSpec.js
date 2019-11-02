describe("LocationService", function() {

    it("init should build the world and add the change location function to the game", function() {
        StoryScript.ObjectFactory.GetGame();
        var definitions = StoryScript.ObjectFactory.GetDefinitions();
        var game = {
            definitions: {}
        };

        var service = getService(game, definitions);
        service.init(game);

        expect(game.changeLocation).not.toBeNull();
        expect(game.currentLocation).toBeNull();
        expect(game.previousLocation).toBeNull();
        expect(game.locations.length).toBe(5);
    });

    it("save world should call dataservice save", function() {
        var dataService = {
            save: function() {}
        };

        spyOn(dataService, 'save');

        var service = getService({}, {}, dataService);
        service.saveWorld({});
        expect(dataService.save).toHaveBeenCalled();
    });
    
    it("copy world should call dataservice copy", function() {
        var dataService = {
            copy: function() {}
        };

        spyOn(dataService, 'copy');

        var service = getService({}, {}, dataService);
        service.copyWorld({});
        expect(dataService.copy).toHaveBeenCalled();
    });

    function getService(game, definitions, dataService) {
        var data = null;

        var dataService = dataService || {
            save: function(key, value) { data = value; },
            load: function(key) { return data; }
        }

        return new StoryScript.LocationService(dataService, {}, {}, game, definitions);
    }
});