import {describe, expect, test} from 'vitest';
import {GameService} from 'storyScript/Services/gameService';
import {EquipmentType, ICharacter, ICompiledLocation, IGame, IItem} from 'storyScript/Interfaces/storyScript';

describe("GameService", function() {

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
    
});

function getService(game?, dataService?, locationService?, characterService?, combinationService?, rules?, helperService?, texts?) {
    return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, rules || {}, helperService || {}, game || {}, texts || {});
}