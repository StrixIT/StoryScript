describe("ObjectFactory", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    it("should get the game definitions", function() {
        var result = StoryScript.ObjectFactory.GetDefinitions();
        expect(result).not.toEqual(null);
        expect(result['locations'].length).toEqual(5);
        expect(result['items'].length).toEqual(4);
        expect(result['enemies'].length).toEqual(1);
        expect(result['persons'].length).toEqual(1);
        expect(result['quests'].length).toEqual(1);
        expect(result['actions'].length).toEqual(2);
    });

    it("should get the game functions", function() {
        var result = StoryScript.ObjectFactory.GetFunctions();

        expect(result).not.toEqual(null);

        var locationFunctions = Object.keys(result['locations']);

        expect(locationFunctions.length).toEqual(8);
        expect(Object.keys(result['items']).length).toEqual(1);
        expect(Object.keys(result['quests']).length).toEqual(4);
        expect(Object.keys(result['persons']).length).toEqual(3);

        expect(Object.keys(result['features']).length).toEqual(0);
        expect(Object.keys(result['enemies']).length).toEqual(0);
        expect(Object.keys(result['actions']).length).toEqual(0);

        expect(locationFunctions).toEqual([
            'dirtroad|combatActions|0|execute',
            'garden|enterEvents|0',
            'garden|actions|0|execute',
            'garden|actions|1|execute',
            'bedroom|trade|buy|itemSelector',
            'bedroom|trade|sell|itemSelector',
            'bedroom|trade|sell|priceModifier',
            'start|descriptionSelector'
        ]);
    });
});