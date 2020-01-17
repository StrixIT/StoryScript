import '../../../Games/MyRolePlayingGame/run';
import { IGame, IRules, ICreateCharacterAttribute, ICreateCharacter, EquipmentType, IItem, IQuest, GameState } from 'storyScript/Interfaces/storyScript';
import { CharacterService } from 'storyScript/Services/characterService';
import { Rules } from '../../../Games/MyRolePlayingGame/rules';
import { LeatherBoots } from '../../../Games/MyRolePlayingGame/items/leatherBoots';
import { Journal } from '../../../Games/MyRolePlayingGame/items/journal';
import { Sword } from '../../../Games/MyRolePlayingGame/items/sword';
import { ICharacterRules } from 'storyScript/Interfaces/rules/characterRules';
import { addArrayExtensions } from 'storyScript/globals';
import { GetObjectFactory } from 'storyScript/run';

describe("CharacterService", function() {

    beforeEach(() => {
        addArrayExtensions();
    });

    describe("Character sheet", function() {

        it("Object factory should return character service", function() {
            var factory = GetObjectFactory();
            var service = factory.GetCharacterService();
            expect(service).not.toBeNull();
        });

        it("should return the properties defined for the character sheet", function() {
            var service = getService();
            var result = service.getSheetAttributes().sort();
            var expected = sheetAttributes.sort();
            expect(result).toEqual(expected);
        });

        it("should set the first step of the character sheet as the selected step when starting character creation", function() {    
            var game = <IGame>{};

            var service = getService(game);
            var result = service.setupCharacter();
            var gameSheet = game.createCharacterSheet;
            var createSheet = Rules().character.getCreateCharacterSheet();
            createSheet.currentStep = 0;

            // Remove the next step function from the object for comparison.
            var nextStep = result.nextStep;
            delete result.nextStep;

            expect(result).toEqual(createSheet);
            expect(gameSheet).toEqual(createSheet);

            // Trigger the next step in the sheet to set the selected entry for the question.
            nextStep(result);

            expect(result.steps[1].questions[0].selectedEntry).toEqual(createSheet.steps[1].questions[0].entries[0]);
        });

        it("should set the first step of the level up sheet as the selected step preparing level up", function() {
            var rules = {
                character: {
                    getLevelUpSheet: function() {
                        return levelUpSheet
                    }
                }
            };

            var game = <IGame>{};

            var service = getService(game, rules);
            var result = service.setupLevelUp();
            var gameSheet = game.createCharacterSheet;

            expect(result).toBe(levelUpSheet);
            expect(gameSheet).toBe(levelUpSheet);
            expect(result.steps[0].questions[0].selectedEntry).toBe(levelUpSheet.steps[0].questions[0].entries[0]);
        });

        it("should use a value of 1 when a non-number value was specified", function() {
            var service = new CharacterService(null, null);
            var value = 'test';
            var attribute = getAttributes();
            var entry = attribute.entries[0]
            service.limitSheetInput(parseInt(value), attribute, entry);
            expect(entry.value).toBe(1);
        });

        it("should not allow an attribute to go above the maximum", function() {
            var service = new CharacterService(null, null);
            var value = 5;
            var attribute = getAttributes();
            var entry = attribute.entries[0]
            service.limitSheetInput(value, attribute, entry);
            expect(entry.value).toBe(5);
        });

        it("should not allow an attribute to go below the maximum", function() {
            var service = new CharacterService(null, null);
            var value = -5;
            var attribute = getAttributes();
            var entry = attribute.entries[0]
            service.limitSheetInput(value, attribute, entry);
            expect(entry.value).toBe(1);
        });

        it("should not allow the total to go above the amount of points to distribute", function() {
            var service = new CharacterService(null, null);
            var value = 5;
            var attribute = getAttributes();

            for (var i = 0; i < attribute.entries.length; i++)
            {
                var entry = attribute.entries[i]
                service.limitSheetInput(value, attribute, entry);
            }

            var entries = attribute.entries;
            expect(entries[0].value).toBe(5);
            expect(entries[1].value).toBe(4);
            expect(entries[2].value).toBe(1);
        });

        it("should return true when distribution is done", function() {
            var service = new CharacterService(null, null);
            var options = {
                steps: [
                    {
                        attributes: [
                            getAttributes()
                        ]
                    }
                ]
            };

            var attributes = options.steps[0].attributes;
            attributes[0].entries[0].value = 5;
            attributes[0].entries[1].value = 4;

            var result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeTruthy();

            // Add an additional step. Both should be complete true is returned.
            attributes.push(getAttributes());

            var result = service.distributionDone(options);
            expect(result).toBeFalsy();

            attributes[1].entries[0].value = 5;
            attributes[1].entries[1].value = 4;

            var result = service.distributionDone(options);
            expect(result).toBeTruthy();
        });

        it("should return true when text questions have been answered", function() {
            var service = new CharacterService(null, null);
            var options = {
                steps: [
                    {
                        attributes: [
                            getAttributes()
                        ]
                    }
                ]
            };

            var entries = options.steps[0].attributes[0].entries;
            delete entries[0].max;
            delete entries[1].max;
            delete entries[2].max;
            entries[0].value = null;
            entries[1].value = null;
            entries[2].value = null;

            var result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeFalsy();

            entries[0].value = 'One';
            entries[1].value = 'Two';
            entries[2].value = null;

            var result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeFalsy();

            entries[0].value = 'One';
            entries[1].value = 'Two';
            entries[2].value = 'Three';

            var result = service.distributionDone(options, options.steps[0]);
            expect(result).toBeTruthy();
        });

    });

    describe("Create character", function() {

        it("Should return a created character with attribute and text values filled", function() {
            var rules = <IRules>{
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
            
            var game = <IGame>{};
            var service = new CharacterService(game, rules);

            var sheet = <ICreateCharacter>{
                steps: [
                    {
                        questions: [
                            {
                                selectedEntry: {
                                        value: 'strength',
                                        bonus: 1
                                },
                                entries: [
                                ]
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

            var result = <any>service.createCharacter(game, sheet);

            expect(result.name).toBe('Test');
            expect(result.strength).toBe(2);
            expect(result.agility).toBe(3);
        });

        it("Should return an empty character when no create character rule is available", function() {
            var game = <IGame>{};
            var service = new CharacterService(game, <IRules>{ character: {} });
            var result = service.createCharacter(game, <ICreateCharacter>{});

            expect(result).not.toBeNull();
            expect(result.name).toBe(null);
        });

    });

    describe("Equip", function() {

        it("should allow equipping a non-miscellaneous item", function() {
            var boots = LeatherBoots();
            var service = getService();
            var result = service.canEquip(boots);
            expect(result).toBeTruthy();
        });

        it("should disallow equipping a miscellaneous item", function() {
            var journal = Journal();
            var service = getService();
            var result = service.canEquip(journal);

            expect(result).toBeFalsy();
        });

        it("should equip an item to the right slot and remove the item from the inventory", function() {
            var game = {
                character: {
                    equipment: <any>{},
                    items: []
                }
            }

            var service = getService(game);
            var boots = LeatherBoots();
            game.character.items.push(boots);
            service.equipItem(boots);

            expect(game.character.equipment.feet).not.toBeUndefined();
            expect(game.character.equipment.feet).toBe(boots);
            expect(game.character.items.length).toBe(0);
        });

        it("should equip a two-handed weapon to both hand slots", function() {
            var game = {
                character: {
                    equipment: <any>{},
                    items: []
                }
            }

            var service = getService(game);
            var twoHandedSword = <IItem>{
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ]
            };
            service.equipItem(twoHandedSword);

            expect(game.character.equipment.rightHand).not.toBeUndefined();
            expect(game.character.equipment.leftHand).not.toBeUndefined();
        });

        it("should block equipping a new item when an existing item cannot be unequipped", function() {
            var game = {
                character: {
                    equipment: {
                        rightHand: null
                    },
                    items: []
                }
            }

            var service = getService(game);

            var sword = Sword();
            sword.unequip = function(item, game) {
                return false;
            }

            game.character.equipment.rightHand = sword;

            var newSword = Sword();
            var result = service.equipItem(newSword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBe(sword);
        });

        it("should block equipping a new two-handed item when an existing item cannot be unequipped", function() {
            var game = {
                character: {
                    equipment: <any>{
                        rightHand: null
                    },
                    items: []
                }
            }

            var service = getService(game);

            var sword = Sword();
            sword.unequip = function(item, game) {
                return false;
            }

            game.character.equipment.rightHand = sword;

            var twoHandedSword = <IItem>{
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ]
            };
            var result = service.equipItem(twoHandedSword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBe(sword);
            expect(game.character.equipment.leftHand).toBeUndefined();
        });

        it("should block equipping a new item when an existing two-handed item cannot be unequipped", function() {
            var game = {
                character: {
                    equipment: <any>{
                        rightHand: null
                    },
                    items: []
                }
            }

            var service = getService(game);

            var twoHandedSword = {
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ],
                unequip: function(item, game) {
                    return false;
                }
            };

            var sword = Sword();

            game.character.equipment.rightHand = twoHandedSword;
            game.character.equipment.leftHand = twoHandedSword;

            var result = service.equipItem(sword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBe(twoHandedSword);
            expect(game.character.equipment.leftHand).toBe(twoHandedSword);
        });

        it("should block equipping an item which disallows equipping", function() {
            var game = {
                character: {
                    equipment: <any>{}
                }
            }

            var service = getService(game);

            var sword = Sword();
            sword.equip = function(item, game) {
                return false;
            }

            var result = service.equipItem(sword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBeUndefined();
        });

        it("should move an equipped item back to the backpack when equipping an item of the same type", function() {
            var game = {
                character: {
                    equipment: <any>{},
                    items: []
                }
            }
            var service = getService(game);
            var equippedBoots = LeatherBoots();
            var backPackBoots = LeatherBoots();
            game.character.equipment.feet = equippedBoots;
            game.character.items.push(backPackBoots);
            service.equipItem(backPackBoots);

            expect(game.character.equipment.feet).not.toBeUndefined();
            expect(game.character.equipment.feet).toBe(backPackBoots);

            expect(game.character.items.length).toBe(1);
            expect(game.character.items[0]).toBe(equippedBoots); 
        });

        it("should block equipping an item when game rules disallow it", function() {
            var game = {
                character: {
                    equipment: <any>{},
                    items: []
                }
            }

            var rules = {
                character: {
                    beforeEquip: function(game, character, item) {
                        return false;
                    }
                }
            }

            var service = getService(game, rules);
            var sword = Sword();

            var result = service.equipItem(sword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBeUndefined();
        });

        it("should block unequipping an item when game rules disallow it", function() {
            var game = {
                character: {
                    equipment: <any>{},
                    items: []
                }
            }

            var rules = {
                character: {
                    beforeUnequip: function(game, character, item) {
                        return false;
                    }
                }
            }

            var service = getService(game, rules);
            var sword = Sword();
            game.character.equipment.rightHand = sword;

            var result = service.unequipItem(sword);

            expect(result).toBeFalsy();
            expect(game.character.equipment.rightHand).toBe(sword);
        });

        it("should return false when an equipment slot is not used", function() {
            var game = {
                character: {
                    equipment: {
                        rightHand: undefined
                    },
                    items: []
                }
            }

            var service = getService(game);
            var result = service.isSlotUsed('rightHand');

            expect(result).toBeFalsy();
        });

        it("should return true when an equipment slot is used", function() {
            var sword = Sword();

            var game = {
                character: {
                    equipment: {
                        rightHand: sword
                    },
                    items: []
                }
            }

            var service = getService(game);
            var result = service.isSlotUsed('rightHand');

            expect(result).toBeTruthy();
        });

        it("should drop an item the character has in his backpack", function() {
            var sword = Sword();

            var game = {
                character: {
                    items: [
                        sword
                    ]
                },
                currentLocation: {
                    items: []
                }
            }

            var service = getService(game);
            service.dropItem(sword);

            expect(game.character.items.length).toBe(0);
            expect(game.currentLocation.items.length).toBe(1);
            expect(game.currentLocation.items[0]).toBe(sword);
        });

        it("should return the status of a quest when it is a string", function() {
            var quest = <IQuest>{
                status: 'Started'
            }

            var service = getService();
            var result = service.questStatus(quest);

            expect(result).toBe(<string>quest.status);
        });

        it("should return the status of a quest when it is returned by a function", function() {
            var quest = <any>{
                status: function() { return 'Started' },
                checkDone: function() { return true }
            }

            var service = getService();
            var result = service.questStatus(quest);

            expect(result).toBe(result);
        });
    });

    describe("Level up", function() {

        it("Should call level up and if true is returned process the default settings", function() {
            var valueToReturn = true;
            
            var game = <IGame>{
                character: <any>{
                    strength: 1
                }
            };
            var rules = <IRules>{
                character: <ICharacterRules>{
                    levelUp: (character: any) => {
                        character.isLevelled = true;
                        return valueToReturn;
                    }
                }
            }

            var sheet = levelUpSheet;
            levelUpSheet.steps[0].questions[0].selectedEntry = levelUpSheet.steps[0].questions[0].entries[0];
            game.createCharacterSheet = sheet;

            var service = new CharacterService(game, rules);
            var result = <any>service.levelUp();

            expect(result).not.toBeNull();
            expect(result.isLevelled).toBeTruthy();
            expect(result.strength).toBe(2);

            valueToReturn = false;

            game.character = <any>{ strength: 1 };
            result = service.levelUp();

            expect(result).not.toBeNull();
            expect(result.isLevelled).toBeTruthy();
            expect(result.strength).toBe(1);

            expect(game.state).toEqual(GameState.Play);
        });

    });

    function getAttributes(): ICreateCharacterAttribute {
        return  <ICreateCharacterAttribute>{
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

    var sheetAttributes = [
        'strength',
        'agility',
        'intelligence'
    ];

    var levelUpSheet = <ICreateCharacter>{
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

    function getService(game?: any, rules?: any) {
        return new CharacterService(game || {}, rules || Rules());
    }

});