import { CombinationService } from 'storyScript/Services/CombinationService';
import { ICombinable, IGame, ICombinationAction } from 'storyScript/Interfaces/storyScript';
import { Rules } from '../../../Games/MyRolePlayingGame/types';
import { DefaultTexts } from 'storyScript/defaultTexts';
import { ICombinations } from 'storyScript/Interfaces/combinations/combination';
import { ICombine } from 'storyScript/Interfaces/combinations/combine';
import { Constants } from '../../../Games/MyAdventureGame/constants';

describe("CombinationService", function() {

    it("should return the combinations defined for the game", function() {
        var rules = {
            setup: {
                getCombinationActions: (): ICombinationAction[] => {
                    return [
                        {
                            text: Constants.WALK,
                            preposition: 'to',
                            requiresTool: false
                        },
                        {
                            text: Constants.USE,
                            preposition: 'on'
                        },
                        {
                            text: Constants.TOUCH,
                            requiresTool: false
                        },
                        {
                            text: Constants.LOOKAT,
                            preposition: 'at',
                            requiresTool: false,
                            failText: (game, target, tool): string => { 
                                return 'You look at the ' + target.name + '. There is nothing special about it';
                            }
                        }
                    ];
                }
            }
        };

        var service = getService(null, rules);
        var result = service.getCombinationActions();
        var names = result.map(c => c.text);
        expect(names).toEqual(combinationActionNames);
    });

    describe("Selection classes", function() {

        it("should return an empty string for a class when there is no active combination and no tool", function() {
            var service = getService({
                combinations: {}
            });
            var result = service.getCombineClass(null);
            expect(result).toBe('');
        });

        it("should return the hiding class when there is an active combination and no tool", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass(null);
            expect(result).toBe('combine-active-hide');
        });

        it("should return an empty string for a class when there is a tool but no active combination", function() {
            var service = getService({
                combinations: {
                }
            });
            var result = service.getCombineClass(<ICombinable>{});
            expect(result).toBe('');
        });

        it("should return the selectable class when there is a tool and an active combination but without a tool match", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass(<ICombinable>{});
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
            var result = service.getCombineClass(<ICombinable>{ id: 'test' });
            expect(result).toBe('combine-active-selected');
        });

    });

    describe("Try combinations", function() {

        it("should fail a combination when there is no target or active combination", function() {
            var game = <IGame><unknown>{
                combinations: <ICombinations<ICombinable>>{
                    activeCombination: {
                    },
                    combinationResult: {
                    },
                    combine: [
                        <ICombine<ICombinable>><unknown>{         
                    }]
                }
            };

            var texts = {
                noCombination: "You {2} the {0} {3} the {1}. Nothing happens.",
                noCombinationNoTool: "You {1} {2} the {0}. Nothing happens.",
                format: new DefaultTexts().format
            }

            var service = getService(game, null, texts);
            var result = service.tryCombination(<ICombinable>{});
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
            var ofSameType = JSON.parse(JSON.stringify(target));
            
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
        'Walk',
        'Use',
        'Touch',
        'Look'
    ];

    function getService(game?, rules?, texts?, dataService?, locationService?) {
        return new CombinationService(dataService || {}, locationService || {}, game || {}, rules || Rules(), texts || {});
    }

});