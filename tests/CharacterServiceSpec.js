describe("CharacterService", function() {

    beforeEach(() => {
        // Trigger object factory initialization.
        StoryScript.ObjectFactory.GetGame();
    });

    it("should return the properties defined for the character sheet", function() {
        var service = getService();
        var result = service.getSheetAttributes().sort();
        var expected = sheetAttributes.sort();
        expect(result).toEqual(expected);
    });

    it("should set the first step of the character sheet as the selected step when starting character creation", function() {    
        var game = {};

        var service = getService(game);
        var result = service.setupCharacter();
        var gameSheet = game.createCharacterSheet;
        var createSheet = new _TestGame.Rules().character.getCreateCharacterSheet();
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

        var game = {};

        var service = getService(game, rules);
        var result = service.setupLevelUp();
        var gameSheet = game.createCharacterSheet;

        expect(result).toBe(levelUpSheet);
        expect(gameSheet).toBe(levelUpSheet);
        expect(result.steps[0].questions[0].selectedEntry).toBe(levelUpSheet.steps[0].questions[0].entries[0]);
    });

    it("should allow equipping a non-miscellaneous item", function() {
        var boots = _TestGame.Items.LeatherBoots();
        var service = getService();
        var result = service.canEquip(boots);

        expect(result).toBeTruthy();
    });

    it("should disallow equipping a miscellaneous item", function() {
        var journal = _TestGame.Items.Journal();
        var service = getService();
        var result = service.canEquip(journal);

        expect(result).toBeFalsy();
    });

    it("should equip an item to the right slot and remove the item from the inventory", function() {
        var game = {
            character: {
                equipment: {},
                items: []
            }
        }

        var service = getService(game);
        var boots = _TestGame.Items.LeatherBoots();
        game.character.items.push(boots);
        service.equipItem(boots);

        expect(game.character.equipment.feet).not.toBeUndefined();
        expect(game.character.equipment.feet).toBe(boots);
        expect(game.character.items.length).toBe(0);
    });

    it("should equip a two-handed weapon to both hand slots", function() {
        var game = {
            character: {
                equipment: {},
                items: []
            }
        }

        var service = getService(game);
        var twoHandedSword = {
            equipmentType: [
                StoryScript.EquipmentType.RightHand,
                StoryScript.EquipmentType.LeftHand
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

        var sword = _TestGame.Items.Sword();
        sword.unequip = function(item, game) {
            return false;
        }

        game.character.equipment.rightHand = sword;

        var newSword = _TestGame.Items.Sword();
        var result = service.equipItem(newSword);

        expect(result).toBeFalsy();
        expect(game.character.equipment.rightHand).toBe(sword);
    });

    it("should block equipping a new two-handed item when an existing item cannot be unequipped", function() {
        var game = {
            character: {
                equipment: {
                    rightHand: null
                },
                items: []
            }
        }

        var service = getService(game);

        var sword = _TestGame.Items.Sword();
        sword.unequip = function(item, game) {
            return false;
        }

        game.character.equipment.rightHand = sword;

        var twoHandedSword = {
            equipmentType: [
                StoryScript.EquipmentType.RightHand,
                StoryScript.EquipmentType.LeftHand
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
                equipment: {
                    rightHand: null
                },
                items: []
            }
        }

        var service = getService(game);

        var twoHandedSword = {
            equipmentType: [
                StoryScript.EquipmentType.RightHand,
                StoryScript.EquipmentType.LeftHand
            ],
            unequip: function(item, game) {
                return false;
            }
        };

        var sword = _TestGame.Items.Sword();

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
                equipment: {}
            }
        }

        var service = getService(game);

        var sword = _TestGame.Items.Sword();
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
                equipment: {},
                items: []
            }
        }
        var service = getService(game);
        var equippedBoots = _TestGame.Items.LeatherBoots();
        var backPackBoots = _TestGame.Items.LeatherBoots();
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
                equipment: {},
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
        var sword = _TestGame.Items.Sword();

        var result = service.equipItem(sword);

        expect(result).toBeFalsy();
        expect(game.character.equipment.rightHand).toBeUndefined();
    });

    it("should block unequipping an item when game rules disallow it", function() {
        var game = {
            character: {
                equipment: {},
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
        var sword = _TestGame.Items.Sword();
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
        var sword = _TestGame.Items.Sword();

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
        var sword = _TestGame.Items.Sword();

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
        var quest = {
            status: 'Started'
        }

        var service = getService();
        var result = service.questStatus(quest);

        expect(result).toBe(quest.status);
    });

    it("should return the status of a quest when it is returned by a function", function() {
        var quest = {
            status: function() { return 'Started' },
            checkDone: function() { return true }
        }

        var service = getService();
        var result = service.questStatus(quest);

        expect(result).toBe(result);
    });

    var sheetAttributes = [
        'strength',
        'agility',
        'intelligence'
    ];

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

    function getService(game, rules) {
        return new StoryScript.CharacterService({}, game || {}, rules || new _TestGame.Rules());
    }

});