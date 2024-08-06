import { describe, test, expect } from 'vitest';
import { GameService } from 'storyScript/Services/gameService';
import { IItem, IGame, ICharacter } from 'storyScript/Interfaces/storyScript';

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

});

function getService(dataService?, locationService?, characterService?, combinationService?, rules?, helperService?, game?, texts?) {
    return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, rules || {}, helperService || {}, game || {}, texts || {});
}