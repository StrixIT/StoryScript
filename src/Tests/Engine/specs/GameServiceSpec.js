describe("GameService", function() {

    it("should call the use function on an item", function() {
        var used = false;
        
        var item = {
            use: function() {
                used = true;
            }
        };
        var service = getService();
        service.useItem(item);

        expect(used).toBeTruthy();
    });

    function getService(game, dataService, locationService, characterService, combinationService, events, rules, helperService) {
        return new StoryScript.GameService(dataService || {}, locationService || {}, characterService || {}, combinationService || {}, events || {}, rules || {}, helperService || {}, game || {});
    }
});