describe("Rules", function() {

    // beforeEach(() => {
    //     // Trigger object factory initialization.
    //     StoryScript.ObjectFactory.GetGame();
    // });

    it("should return the properties defined for the character sheet", function() {
        var service = _TestGame.Rules();
        var result = service.setup.getCombinationActions().sort();
        var expected = null;
        expect(result).toEqual(expected);
    });

});