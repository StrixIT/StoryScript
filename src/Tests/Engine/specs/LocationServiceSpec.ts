import { LocationService } from 'storyScript/Services/LocationService';
import { IGame, ICollection, ICompiledLocation } from 'storyScript/Interfaces/storyScript';

describe("LocationService", function() {

    it("init should build the world and add the change location function to the game", function() {
        var dataService = {
            value: null,
            load: function() {
                return this.value;
            },
            save: function(key, data) {
                this.value = data;
            }
        };

        var game = <IGame>{
            definitions: {}
        };

        var service = getService(dataService, {}, game);
        service.init(game);

        expect(game.changeLocation).not.toBeNull();
        expect(game.currentLocation).toBeNull();
        expect(game.previousLocation).toBeNull();
        expect(game.locations.length).toBe(0);
    });

    it("save world should call dataservice save", function() {
        var dataService = {
            save: function() {}
        };

        spyOn(dataService, 'save');

        var service = getService(dataService);
        service.saveWorld(<ICollection<ICompiledLocation>>{});
        expect(dataService.save).toHaveBeenCalled();
    });
    
    it("copy world should call dataservice copy", function() {
        var dataService = {
            copy: function() {}
        };

        spyOn(dataService, 'copy');

        var service = getService(dataService);
        service.copyWorld();
        expect(dataService.copy).toHaveBeenCalled();
    });

});

function getService(dataService?, rules?, game?, definitions?) {
    var data = null;

    var dataService = dataService || {
        save: function(key, value) { data = value; },
        load: function(key) { return data; }
    }

    return new LocationService(dataService, rules || {}, game || {}, definitions || {});
}