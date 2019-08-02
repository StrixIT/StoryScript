describe("CharacterService", function() {

    it("should return the properties defined for the character sheet", function() {
        var rules = {
            getSheetAttributes: function() {
                return sheetAttributes;
            }
        };

        var service = getService(rules);
        var result = service.getSheetAttributes().sort();
        var expected = sheetAttributes.sort();
        expect(result).toBe(expected);
    });

    it("should set the first step of the character sheet as the selected step when starting character creation", function() {    
        var rules = {
            getCreateCharacterSheet: function() {
                return createSheet
            }
        };

        var game = {};

        var service = getService(rules, game);
        var result = service.setupCharacter();
        var gameSheet = game.createCharacterSheet;

        expect(result).toBe(createSheet);
        expect(gameSheet).toBe(createSheet);
        expect(result.steps[0].questions[0].selectedEntry).toBe(createSheet.steps[0].questions[0].entries[0]);
    });

    it("should set the first step of the level up sheet as the selected step preparing level up", function() {
        var rules = {
            getLevelUpSheet: function() {
                return levelUpSheet
            }
        };

        var game = {};

        var service = getService(rules, game);
        var result = service.setupLevelUp();
        var gameSheet = game.createCharacterSheet;

        expect(result).toBe(levelUpSheet);
        expect(gameSheet).toBe(levelUpSheet);
        expect(result.steps[0].questions[0].selectedEntry).toBe(levelUpSheet.steps[0].questions[0].entries[0]);
    });

    var sheetAttributes = [
        'Strength',
        'Agility',
        'Intelligence'
    ];

    var createSheet = {
        steps: [
            {
                questions: [
                    {
                        question: 'As a child, you were always...',
                        entries: [
                            {
                                text: 'strong in fights',
                                value: 'strength',
                                bonus: 1
                            },
                            {
                                text: 'a fast runner',
                                value: 'agility',
                                bonus: 1
                            },
                            {
                                text: 'a curious reader',
                                value: 'intelligence',
                                bonus: 1
                            }
                        ]
                    }
                ]
            }
        ]
    };

    var levelUpSheet = {
        steps: [
            {
                questions: [
                    {
                        question: 'Gaining more experience, you become...',
                        entries: [
                            {
                                text: 'Stronger',
                                value: 'strength',
                                bonus: 1
                            },
                            {
                                text: 'Faster',
                                value: 'agility',
                                bonus: 1
                            },
                            {
                                text: 'Smarter',
                                value: 'intelligence',
                                bonus: 1
                            }
                        ]
                    }
                ]
            }
        ]
    };

    function getService(rules, game) {
        return new StoryScript.CharacterService({}, game || {}, rules || {});
    }

});