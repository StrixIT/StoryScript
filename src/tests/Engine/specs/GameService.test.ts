import {beforeAll, describe, expect, test} from 'vitest';
import {GameService} from 'storyScript/Services/GameService';
import {ICharacter, ICompiledLocation, IGame, IRules} from 'storyScript/Interfaces/storyScript';
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {ISaveGame} from "storyScript/Interfaces/saveGame.ts";
import {ILocationService} from "storyScript/Interfaces/services/locationService.ts";
import {addArrayExtensions} from "storyScript/arrayAndFunctionExtensions.ts";

describe("GameService", function () {

    beforeAll(() => {
        addArrayExtensions();
    });

    test("should init readonly party properties when loading a game", function () {
        const character = <ICharacter>{
            items: []
        }

        const game = <IGame>{
            sounds: {},
            combinations: {
                combinationResult: {
                    reset: () => {
                    }
                }
            }
        };

        const rules = <IRules>{
            setup: {}
        };

        const saveGame = <ISaveGame>{
            party: {
                characters: [
                    {...character}, {...character}, {...character}
                ],
                currentLocationId: 'start'
            },
            world: <any>{
                'start': <ICompiledLocation>{},
                get: () => <ICompiledLocation>{}
            }
        }

        const dataService = <IDataService>{
            load: (key) => saveGame
        };

        const locationService = <ILocationService>{
            init: () => {
            },
            loadLocationDescriptions: (game) => {
            },
            processDestinations: (game: IGame) => {
            }
        }

        const service = getService(game, dataService, locationService, null, null, null, rules);
        service.loadGame('');
        game.party.characters.forEach((c) => expect(c.combatItems).toBeDefined());
    });
});

function getService(game?, dataService?, locationService?, characterService?, combinationService?, soundService?, rules?, helperService?, texts?) {
    return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, soundService || {}, rules || {}, helperService || {}, game || {}, texts || {});
}