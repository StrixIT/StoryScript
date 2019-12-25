import { GameService } from 'storyScript/Services/gameService';
import { IItem, IGame } from 'storyScript/Interfaces/storyScript';

describe("GameService", function() {

    it("should call the use function on an item", function() {
        var used = false;
        
        var item = <IItem>{
            use: (game: IGame, item: IItem) => {
                used = true;
            }
        };
        var service = getService();
        service.useItem(item);

        expect(used).toBeTruthy();
    });

    function getService(dataService?, locationService?, characterService?, combinationService?, rules?, helperService?, game?, texts?) {
        return new GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, rules || {}, helperService || {}, game || {}, texts || {});
    }
});