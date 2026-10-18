import {describe, expect, test} from 'vitest';
import {LocationService} from 'src/Engine/Services';
import {ICompiledLocation, IGame, IGameEvents, IRules} from 'storyScript';

describe("LocationService", function () {

    test("init should build the world", function () {
        const dataService = {
            value: null,
            load: function () {
                return this.value;
            },
            save: function (key, data) {
                this.value = data;
            }
        };

        const game = <IGame>{};
        const service = getService(dataService, {}, game);
        service.init();

        expect(game.currentLocation).toBeNull();
        expect(game.previousLocation).toBeNull();
        expect(game.locations).toEqual({});
    });

    test("should set the location description", function () {
        const game = <IGame>{
            statistics: {},
            locations: <Record<string, ICompiledLocation>>{
                start: {
                    id: 'start',
                    type: 'location',
                    description: undefined,
                    name: 'Start'
                }
            }
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
        save: function (key, value) {
            data = value;
        },
        load: function (key) {
            return data;
        }
    }

    return new LocationService(definitions ?? {}, rules ?? {}, game ?? {}, <IGameEvents>{});
}