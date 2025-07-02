import {beforeAll, describe, expect, test} from 'vitest';
import {
    EquipmentType,
    GameState,
    ICharacter,
    ICreateCharacter,
    ICreateCharacterAttribute,
    IGame,
    IItem,
    IQuest,
    IRules
} from 'storyScript/Interfaces/storyScript';
import {CharacterService} from 'storyScript/Services/CharacterService';
import {Rules} from '../../../Games/MyRolePlayingGame/rules';
import {ICharacterRules} from 'storyScript/Interfaces/rules/characterRules';
import {addArrayExtensions} from 'storyScript/arrayAndFunctionExtensions';
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {DataSerializer} from "storyScript/Services/DataSerializer.ts";
import {DataSynchronizer} from "storyScript/Services/DataSynchronizer.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";

describe("CharacterService", function () {

    beforeAll(() => {
        addArrayExtensions();
    });

    describe("Character sheet", function () {

        test("should return the properties defined for the character sheet", function () {
            const service = getService();
            const result = service.getSheetAttributes().sort();
            const expected = sheetAttributes.sort();
            expect(result).toEqual(expected);
        });

        test("should set the first step of the character sheet as the selected step when starting character creation", function () {
            const game = <IGame>{};

            const service = getService({}, game);
            const result = service.setupCharacter();
            const gameSheet = game.createCharacterSheet;
            const createSheet = Rules().character.getCreateCharacterSheet();
            createSheet.currentStep = 0;

            // Remove the next step function from the object for comparison.
            const nextStep = result.nextStep;
            delete result.nextStep;

            expect(result).toEqual(createSheet);
            expect(gameSheet).toEqual(createSheet);

            // Trigger the next step in the sheet to set the selected entry for the question.
            nextStep(result);

            expect(result.steps[1].questions[0].selectedEntry).toEqual(createSheet.steps[1].questions[0].entries[0]);
        });

        test("should set the first step of the level up sheet as the selected step preparing level up", function () {
            const rules = {
                character: {
                    getLevelUpSheet: function () {
                        return levelUpSheet
                    }
                }
            };

            const game = <IGame>{};

            const service = getService({}, game, rules);
            const result = service.setupLevelUp();
            const gameSheet = game.createCharacterSheet;

            expect(result).toBe(levelUpSheet);
            expect(gameSheet).toBe(levelUpSheet);
            expect(result.steps[0].questions[0].selectedEntry).toBe(levelUpSheet.steps[0].questions[0].entries[0]);
        });

        test("should use a value of 1 when a non-number value was specified", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const value = 'test';
            const attribute = getAttributes();
            const entry = attribute.entries[0]
            service.limitSheetInput(parseInt(value), attribute, entry);
            expect(entry.value).toBe(1);
        });

        test("should not allow an attribute to go above the maximum", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const value = 5;
            const attribute = getAttributes();
            const entry = attribute.entries[0]
            service.limitSheetInput(value, attribute, entry);
            expect(entry.value).toBe(5);
        });

        test("should not allow an attribute to go below the maximum", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const value = -5;
            const attribute = getAttributes();
            const entry = attribute.entries[0]
            service.limitSheetInput(value, attribute, entry);
            expect(entry.value).toBe(1);
        });

        test("should not allow the total to go above the amount of points to distribute", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const value = 5;
            const attribute = getAttributes();

            for (let i = 0; i < attribute.entries.length; i++) {
                const entry = attribute.entries[i]
                service.limitSheetInput(value, attribute, entry);
            }

            const entries = attribute.entries;
            expect(entries[0].value).toBe(5);
            expect(entries[1].value).toBe(4);
            expect(entries[2].value).toBe(1);
        });

        test("should return true when distribution is done", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const options = {
                steps: [
                    {
                        attributes: [
                            getAttributes()
                        ]
                    }
                ]
            };

            const attributes = options.steps[0].attributes;
            attributes[0].entries[0].value = 5;
            attributes[0].entries[1].value = 4;

            let result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeTruthy();

            // Add an additional step. Both should be complete true is returned.
            attributes.push(getAttributes());

            result = service.distributionDone(options);
            expect(result).toBeFalsy();

            attributes[1].entries[0].value = 5;
            attributes[1].entries[1].value = 4;

            result = service.distributionDone(options);
            expect(result).toBeTruthy();
        });

        test("should return true when text questions have been answered", function () {
            const service = new CharacterService(<IDataService>{}, null, null);
            const options = {
                steps: [
                    {
                        attributes: [
                            getAttributes()
                        ]
                    }
                ]
            };

            const entries = options.steps[0].attributes[0].entries;
            delete entries[0].max;
            delete entries[1].max;
            delete entries[2].max;
            entries[0].value = null;
            entries[1].value = null;
            entries[2].value = null;

            let result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeFalsy();

            entries[0].value = 'One';
            entries[1].value = 'Two';
            entries[2].value = null;

            result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeFalsy();

            entries[0].value = 'One';
            entries[1].value = 'Two';
            entries[2].value = 'Three';

            result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeTruthy();
        });

    });

    describe("Create character", function () {

        test("Should return a created character with attribute and text values filled", function () {
            const rules = <IRules>{
                character: <ICharacterRules>{
                    createCharacter: () => {
                        return <any>{
                            name: 'Test',
                            strength: 1,
                            agility: 1
                        }
                    }
                }
            }

            const game = <IGame>{};
            const service = new CharacterService(<IDataService>{}, game, rules);

            const sheet = <ICreateCharacter>{
                steps: [
                    {
                        questions: [
                            {
                                selectedEntry: {
                                    value: 'strength',
                                    bonus: 1
                                },
                                entries: []
                            }
                        ],
                        attributes: [
                            {
                                entries: [
                                    {
                                        attribute: 'agility',
                                        value: 3
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }

            const result = <any>service.createCharacter(game, sheet);

            expect(result.name).toBe('Test');
            expect(result.strength).toBe(2);
            expect(result.agility).toBe(3);
        });

        test("Should return an empty character when no create character rule is available", function () {
            const game = <IGame>{};
            const service = new CharacterService(<IDataService>{}, game, <IRules>{character: {}});
            const result = service.createCharacter(game, <ICreateCharacter>{});

            expect(result).not.toBeNull();
            expect(result.name).toBe(null);
        });

    });

    describe("quest status", function () {

        test("should return the status of a quest when it is a string", function () {
            const quest = <IQuest>{
                status: 'Started'
            }

            const service = getService();
            const result = service.questStatus(quest);

            expect(result).toBe(<string>quest.status);
        });

        test("should return the status of a quest when it is returned by a function", function () {
            const quest = <any>{
                status: function () {
                    return 'Started'
                },
                checkDone: function () {
                    return true
                }
            }

            const service = getService();
            const result = service.questStatus(quest);

            expect(result).toBe(result);
        });
    });

    describe("Level up", function () {

        test("Should call level up and if true is returned process the default settings", function () {
            let valueToReturn = true;

            let character = <any>{
                strength: 1
            };

            const game = <IGame>{};

            const rules = <IRules>{
                character: <ICharacterRules>{
                    levelUp: (character: any) => {
                        character.isLevelled = true;
                        return valueToReturn;
                    }
                }
            }

            const sheet = levelUpSheet;
            levelUpSheet.steps[0].questions[0].selectedEntry = levelUpSheet.steps[0].questions[0].entries[0];
            game.createCharacterSheet = sheet;

            const service = new CharacterService(<IDataService>{
                saveGame(game: IGame, name?: string) {
                }
            }, game, rules);
            let result = <any>service.levelUp(character);

            expect(result).not.toBeNull();
            expect(result.isLevelled).toBeTruthy();
            expect(result.strength).toBe(2);

            valueToReturn = false;

            character = <any>{strength: 1};
            result = service.levelUp(character);

            expect(result).not.toBeNull();
            expect(result.isLevelled).toBeTruthy();
            expect(result.strength).toBe(1);

            expect(game.state).toEqual(GameState.Play);
        });

    });

    describe("Check equipment", function () {

        test("resume should move invalid equipment back to backpack", function () {
            const amulet = <IItem>{
                name: 'Amulet',
                equipmentType: EquipmentType.Amulet
            };

            const character = <ICharacter>{
                equipment: {
                    leftHand: amulet
                },
                items: []
            };

            const game = <IGame>{
                party: {
                    characters: [
                        character
                    ]
                }
            };

            const service = getService({}, game, {});
            service.checkEquipment();
            expect(character.equipment.leftHand).toBeNull();
            expect(character.items[0]).toEqual(amulet);
        });

        test("resume should not unequip an item that can use multiple slots", function () {
            const dagger = <IItem>{
                name: 'Dagger',
                equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand]
            };

            const character = <ICharacter>{
                equipment: {
                    leftHand: dagger
                },
                items: []
            };

            const game = <IGame>{
                party: {
                    characters: [
                        character
                    ]
                }
            };

            const service = getService({}, game, {});
            service.checkEquipment();
            expect(character.equipment.leftHand).toEqual(dagger);
            expect(character.items[0]).toBeUndefined();
        });

        test("resume should move invalid equipment using multiple slots back to the backpack", function () {
            const twoHandedSword = <IItem>{
                name: 'Two-handed Sword',
                equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand],
                usesMultipleSlots: true
            };

            const character = <ICharacter>{
                equipment: {
                    rightHand: twoHandedSword
                },
                items: []
            };

            const game = <IGame>{
                party: {
                    characters: [
                        character
                    ]
                }
            };

            const service = getService({}, game, {});
            service.checkEquipment();
            expect(character.equipment.leftHand).toBeUndefined();
            expect(character.items[0]).toEqual(twoHandedSword);
        });

        test("resume should not unequip a correctly equipped multi-slot item", function () {
            const twoHandedSword = <IItem>{
                name: 'Two-handed Sword',
                equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand],
                usesMultipleSlots: true
            };

            const character = <ICharacter>{
                equipment: {
                    rightHand: twoHandedSword,
                    leftHand: twoHandedSword
                },
                items: []
            };

            const game = <IGame>{
                party: {
                    characters: [
                        character
                    ]
                }
            };

            const service = getService({}, game, {});
            service.checkEquipment();
            expect(character.equipment.rightHand).toEqual(twoHandedSword);
            expect(character.equipment.leftHand).toEqual(twoHandedSword);
            expect(character.items[0]).toBeUndefined();
        });

        test("resume should remove duplicated equipped multi-slot items", function () {
            const itemId = 'twohandedsword';

            const twoHandedSword = <IItem>{
                name: 'Two-handed Sword',
                type: 'item',
                id: itemId,
                equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand],
                usesMultipleSlots: true
            };

            const pristineEntities = {
                items: [
                    {[itemId]: twoHandedSword}
                ]
            }

            const character = <ICharacter>{
                equipment: {
                    rightHand: twoHandedSword,
                    leftHand: twoHandedSword
                }
            };

            const serializer = new DataSerializer(pristineEntities);
            const synchronizer = new DataSynchronizer(pristineEntities);
            const restoredCharacter = serializer.restoreObjects(serializer.createSerializableClone(character));
            synchronizer.synchronizeEntityData(restoredCharacter);

            const game = <IGame>{
                party: {
                    characters: [
                        restoredCharacter
                    ]
                }
            };

            const service = getService({}, game, {});
            service.checkEquipment();
            expect(restoredCharacter.equipment.rightHand).toEqual(twoHandedSword);
            expect(restoredCharacter.equipment.leftHand).toEqual(twoHandedSword);
            expect(restoredCharacter.equipment.rightHand).toBe(restoredCharacter.equipment.leftHand);
        });
    });
    
    describe("Equipment slots", function() {
        test("should return false when an equipment slot is not used", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: undefined
                },
                items: []
            };

            const service = getService();
            const result = service.isSlotUsed(character, 'rightHand');

            expect(result).toBeFalsy();
        });

        test("should return true when an equipment slot is used", function () {
            const sword = Sword();

            const character = <ICharacter>{
                equipment: {
                    rightHand: sword
                },
                items: []
            }

            const service = getService();
            const result = service.isSlotUsed(character, 'rightHand');

            expect(result).toBeTruthy();
        });
    });
});

function getAttributes(): ICreateCharacterAttribute {
    return <ICreateCharacterAttribute>{
        numberOfPointsToDistribute: 10,
        entries: [
            {
                attribute: 'Strength',
                value: 1,
                min: 1,
                max: 5
            },
            {
                attribute: 'Agility',
                value: 1,
                min: 1,
                max: 5
            },
            {
                attribute: 'Intelligence',
                value: 1,
                min: 1,
                max: 5
            }
        ]
    };
}

const sheetAttributes = [
    'strength',
    'agility',
    'intelligence'
];

const levelUpSheet = <ICreateCharacter>{
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

function getService(dataService?: any, game?: any, rules?: any) {
    return new CharacterService(dataService || {}, game || {}, rules || Rules());
}