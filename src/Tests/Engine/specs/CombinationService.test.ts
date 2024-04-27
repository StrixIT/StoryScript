import { describe, test, expect, beforeAll } from 'vitest';
import { CombinationService } from 'storyScript/Services/CombinationService';
import { ICombinable, IGame, ICombinationAction, ICombinationMatchResult, IInterfaceTexts } from 'storyScript/Interfaces/storyScript';
import { Rules } from '../../../Games/MyRolePlayingGame/types';
import { DefaultTexts } from 'storyScript/defaultTexts';
import { IActiveCombination } from '../../../Engine/Interfaces/combinations/activeCombination';
import { Combinations } from '../../../Games/MyAdventureGame/combinations';
import { addArrayExtensions } from '../../../Engine/globals';

describe("CombinationService", function() {

    beforeAll(() => addArrayExtensions());

    test("should return the combinations defined for the game", function() {
        var rules = {
            setup: {
                getCombinationActions: (): ICombinationAction[] => {
                    return [
                        {
                            text: Combinations.WALK,
                            preposition: 'to',
                            requiresTool: false
                        },
                        {
                            text: Combinations.USE,
                            preposition: 'on'
                        },
                        {
                            text: Combinations.TOUCH,
                            requiresTool: false
                        },
                        {
                            text: Combinations.LOOKAT,
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

        test("should return an empty string for a class when there is no active combination and no tool", function() {
            var service = getService({
                combinations: {}
            });
            var result = service.getCombineClass(null);
            expect(result).toBe('');
        });

        test("should return the hiding class when there is an active combination and no tool", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass(null);
            expect(result).toBe('combine-active-hide');
        });

        test("should return an empty string for a class when there is a tool but no active combination", function() {
            var service = getService({
                combinations: {
                }
            });
            var result = service.getCombineClass(<ICombinable>{});
            expect(result).toBe('');
        });

        test("should return the selectable class when there is a tool and an active combination but without a tool match", function() {
            var service = getService({
                combinations: {
                    activeCombination: {}
                }
            });
            var result = service.getCombineClass(<ICombinable>{});
            expect(result).toBe('combine-selectable');
        });

        test("should return the selected class when there is a tool and an active combination that has a tool with the same id", function() {
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

        test("should fail a combination when there is no target or active combination", function() {
            var game = <IGame>{
                combinations: {
                    activeCombination: {
                    },
                    combinationResult: {
                    }
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

        test("should remove only the target feature, not all features of the type", function() {    
            const combinationType = Combinations.TOUCH;

            const target = { name: 'Ball', type: 'item', id: 'ball', combinations: {
                combine: [
                    {
                        combinationType: combinationType,
                        match: (game, target, tool): ICombinationMatchResult => {
                            return { 
                                text: '', 
                                removeTarget: true 
                            };
                        }
                    },
                ]
            } };

            const ofSameType = JSON.parse(JSON.stringify(target));
            
            const game = <IGame>{
                combinations: {
                    activeCombination: <IActiveCombination>{
                        selectedCombinationAction: {
                            text: combinationType,
                            requiresTool: false
                        }
                    },
                    combinationResult: {}
                },
                currentLocation: <any>{
                    items: [
                        target
                    ]
                },
                activeCharacter: {
                    items: [
                        ofSameType
                    ]
                }
            };

            var rules = {
                general: {

                }
            };

            var service = getService(game, rules);
            
            var result = service.tryCombination(target);
            expect(result.success).toBeTruthy();
            expect(result.removeTarget).toBeTruthy();
            expect(game.currentLocation.items.length).toBe(0);
            expect(game.activeCharacter.items.length).toBe(1);
        });

        test("should throw an error when there are two combinations of the same type without a tool or with the same tool", function() {
            // Todo: create test!
        });

        test("should work with two combinations of the same type but with different tools", function() {
            // Todo: create test!
        });
    });

});

var combinationActionNames = [
    'Walk',
    'Use',
    'Touch',
    'Look'
];

function getService(game?, rules?, texts?, dataService?, locationService?) {
    texts ??= <IInterfaceTexts>{
        format: () => ''
    }

    dataService ??= {
        save: () => {},
    }

    locationService ??= {
        saveWorld: () => {}
    }

    return new CombinationService(dataService, locationService, game || {}, rules || Rules(), texts);
}