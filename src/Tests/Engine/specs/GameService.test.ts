import {beforeAll, describe, expect, test} from 'vitest';
import {GameService} from 'src/Engine/Services';
import {ICharacter, ICompiledLocation, IDataService, IGame, ILocationService, IRules, ISaveGame} from 'storyScript';
import {addArrayExtensions} from "src/Engine/arrayAndFunctionExtensions";

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

function getService(game?, dataService?, locationService?, characterService?, combinationService?, soundService?, rules?, texts?) {
    return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, soundService || {}, rules || {}, game || {}, texts || {});
}