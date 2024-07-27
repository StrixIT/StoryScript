import { describe, test, expect, vi } from 'vitest';
import { LocationService } from 'storyScript/Services/LocationService';
import { IGame, ICollection, ICompiledLocation, IRules } from 'storyScript/Interfaces/storyScript';

describe("LocationService", function() {

    test("init should build the world and add the change location function to the game", function() {
        const dataService = {
            value: null,
            load: function() {
                return this.value;
            },
            save: function(key, data) {
                this.value = data;
            }
        };

        const game = <IGame>{
            definitions: {}
        };

        const service = getService(dataService, {}, game);
        service.init(game);

        expect(game.changeLocation).not.toBeNull();
        expect(game.currentLocation).toBeNull();
        expect(game.previousLocation).toBeNull();
        expect(game.locations.length).toBe(0);
    });

    test("save world should call dataservice save", function() {
        const dataService = {
            save: function() {}
        };

        vi.spyOn(dataService, 'save');

        const service = getService(dataService);
        service.saveWorld(<ICollection<ICompiledLocation>>{});
        expect(dataService.save).toHaveBeenCalled();
    });

    test("should set the location description", function() {
        const game = <IGame>{
            statistics: {},
            locations: [
                <ICompiledLocation>{
                    id: 'start',
                    type: 'location',
                    description: undefined,
                    name: 'Start'
                }
            ]
        };
        const rules = <IRules>{
            setup: {}
        }

        const descriptionText = 'Start description loaded';
        const startDescription = `<description>${descriptionText}</description>`;
        const descriptions = new Map<string, string>();
        descriptions.set('location_start', startDescription);
        const service = getService(null, rules, game, null, descriptions);
        service.changeLocation('Start', true, game);
        expect(game.currentLocation.description).toBe(descriptionText);
    });

});

function getService(dataService?, rules?, game?, definitions?, descriptions?) {
    let data = null;

    dataService = dataService || {
        save: function(key, value) { data = value; },
        load: function(key) { return data; }
    }

    return new LocationService(dataService, rules || {}, game || {}, definitions || {}, descriptions || {});
}