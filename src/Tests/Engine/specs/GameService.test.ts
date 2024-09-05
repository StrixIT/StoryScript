import {beforeAll, describe, expect, test} from 'vitest';
import {GameService} from 'storyScript/Services/gameService';
import {EquipmentType, ICharacter, ICompiledLocation, IGame, IItem, IRules} from 'storyScript/Interfaces/storyScript';
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {ISaveGame} from "storyScript/Interfaces/saveGame.ts";
import {ILocationService} from "storyScript/Interfaces/services/locationService.ts";
import {addArrayExtensions} from "storyScript/arrayAndFunctionExtensions.ts";

describe("GameService", function() {

    beforeAll(() => {
        addArrayExtensions();
    });
    
    test("should call the use function on an item", function() {
        let used = false;
        const character = <ICharacter>{};
        
        const item = <IItem>{
            use: (game: IGame, character: ICharacter, item: IItem) => {
                used = true;
            }
        };

        const service = getService();
        service.useItem(character, item);

        expect(used).toBeTruthy();
    });

    test("resume should move invalid equipment back to backpack", function() {
        const amulet = <IItem>{
            name: 'Amulet',
            equipmentType: EquipmentType.Amulet
        };
        
        const character = <ICharacter>{
            equipment: {
                leftHand: amulet
            },
            items: []
        };
        
        const game = <IGame>{
            party: {
                characters: [
                    character
                ]
            },
            locations: <any>{
                'start': <ICompiledLocation>{}
            }
        };
        
        const locationService = {
            changeLocation: () => {}
        }
        
        const service = getService(game, {}, locationService);
        service.resume(null);
        expect(character.equipment.leftHand).toBeNull();
        expect(character.items[0]).toEqual(amulet);
    });

    test("should init readonly party properties when loading a game", function() {
        const character = <ICharacter>{
            items: []
        }
        
        const game = <IGame>{
            sounds: {},
            combinations: {
                combinationResult: {
                    reset: () => {}
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
            init: () => {},
            loadLocationDescriptions: (game) => {}
        }
        
        const service = getService(game, dataService, locationService, null, null, rules);
        service.loadGame('');
        game.party.characters.forEach((c) => expect(c.combatItems).toBeDefined());
    });
});

function getService(game?, dataService?, locationService?, characterService?, combinationService?, rules?, helperService?, texts?) {
    return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, rules || {}, helperService || {}, game || {}, texts || {});
}