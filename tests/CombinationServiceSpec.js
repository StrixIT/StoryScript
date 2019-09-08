describe("CombinationService", function() {

    it("should return the combinations defined for the game", function() {
        var service = getService();
        var result = service.getCombinationActions();
        var names = result.map(c => c.text);
        expect(names).toEqual(combinationActionNames);
    });

    describe("Selection classes", function() {

        it("should return an empty string for a class when there is no active combination and no tool", function() {
            var service = getService({
                combinations: {}
            });
            var result = service.getCombineClass();
            expect(result).toBe('');
        });

        it("should return the hiding class when there is an active combination and no tool", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass();
            expect(result).toBe('combine-active-hide');
        });

        it("should return an empty string for a class when there is a tool but no active combination", function() {
            var service = getService({
                combinations: {
                }
            });
            var result = service.getCombineClass({});
            expect(result).toBe('');
        });

        it("should return the selectable class when there is a tool and an active combination but without a tool match", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass({});
            expect(result).toBe('combine-selectable');
        });

        it("should return the selected class when there is a tool and an active combination that has a tool with the same id", function() {
            var service = getService({
                combinations: {
                    activeCombination: {
                        selectedTool: {
                            id: 'test'
                        }
                    }
                }
            });
            var result = service.getCombineClass({ id: 'test' });
            expect(result).toBe('combine-active-selected');
        });

    });

    describe("Try combinations", function() {

        it("should fail a combination when there is no target or active combination", function() {
            var game = {
                combinations: {
                    activeCombination: {}
                }
            };

            var texts = {
                noCombination: "You {2} the {0} {3} the {1}. Nothing happens.",
                noCombinationNoTool: "You {1} {2} the {0}. Nothing happens.",
                format: new StoryScript.DefaultTexts().format
            }

            var service = getService(game, null, texts);
            var result = service.tryCombination();
            expect(result.success).toBeFalsy();

            var target = { name: 'Ball' };

            var result = service.tryCombination(target);
            expect(result.success).toBeFalsy();

            var activeCombination = game.combinations.activeCombination;
            activeCombination.selectedCombinationAction = { text: 'Take' };

            var result = service.tryCombination(target);
            expect(result.success).toBeFalsy();
            expect(result.text).toBe('Take Ball: You Take the Ball. Nothing happens.');
        });

        it("should remove only the target feature, not all features of the type", function() {    
            var target = { name: 'Ball', type: 'item', id: 'ball' };
            var ofSameType = StoryScript.extend({}, target);
            
            var game = {
                combinations: {
                    activeCombination: {}
                },
                locations: [
                    {
                        items: [
                            target
                        ]
                    }
                ],
                character: {
                    items: [
                        ofSameType
                    ]
                }
            };

            var rules = {

            };

            var service = getService(game, rules);
            
            var result = service.tryCombination(target);
        });
    });


    var combinationActionNames = [
        'Use',
        'Look',
        'Pull',
        'Push'
    ];

    function getService(game, rules, texts) {
        return new StoryScript.CombinationService({}, {}, game, rules || _TestGame.Rules(), texts || {});
    }

});