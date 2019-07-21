describe("LocalStorage", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    it("should retrieve an enemy using the function name or id string", function() {
        var service = StoryScript.ObjectFactory.GetHelperService();
        var nameSpace = StoryScript.ObjectFactory.GetNameSpace();
        var game = StoryScript.ObjectFactory.GetGame();
        var expected = game.definitions.items.find(l => l.name === 'Sword')();

        var getWithId = service.getItem('Sword');

        expect(getWithId).toEqual(expected);

        var getWithFunction = service.getItem(window[nameSpace].Items.Sword);

        expect(getWithFunction).toEqual(expected);

    });
});