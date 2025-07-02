import {beforeAll, describe, expect, test} from "vitest";
import {addArrayExtensions} from "storyScript/arrayAndFunctionExtensions.ts";
import {LeatherBoots} from "../../../Games/MyRolePlayingGame/items/leatherBoots.ts";
import {Journal} from "../../../Games/MyRolePlayingGame/items/journal.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {EquipmentType} from "storyScript/Interfaces/enumerations/equipmentType.ts";
import {Sword} from "../../../Games/MyRolePlayingGame/items/sword.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {Rules} from "../../../Games/MyRolePlayingGame/rules.ts";
import {ItemService} from "storyScript/Services/ItemService.ts";
import {DefaultTexts} from "storyScript/defaultTexts.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import {IItem, IGroupableItem} from "../../../Games/MyRolePlayingGame/interfaces/item.ts";

describe("ItemService", function () {

    beforeAll(() => {
        addArrayExtensions();
    });

    describe("Equip", function () {

        test("should allow equipping a non-miscellaneous item", function () {
            const boots = LeatherBoots();
            const service = getService();
            const result = service.isEquippable(boots);
            expect(result).toBeTruthy();
        });

        test("should disallow equipping a miscellaneous item", function () {
            const journal = Journal();
            const service = getService();
            const result = service.isEquippable(journal);

            expect(result).toBeFalsy();
        });

        test("should equip an item to the right slot and remove the item from the inventory", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            }

            const service = getService();
            const boots = LeatherBoots();
            character.items.push(boots);
            service.equipItem(character, boots);

            expect(character.equipment.feet).not.toBeNull();
            expect(character.equipment.feet).toBe(boots);
            expect(character.items.length).toBe(0);
        });

        test("should equip a two-handed weapon to both hand slots", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            }

            const service = getService();
            const twoHandedSword = <IItem>{
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ],
                usesMultipleSlots: true
            };
            service.equipItem(character, twoHandedSword);

            expect(character.equipment.rightHand).not.toBeNull();
            expect(character.equipment.leftHand).not.toBeNull();
        });

        test("should block equipping a new item when an existing item cannot be unequipped", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: null
                },
                items: []
            }

            const service = getService();
            const sword = Sword();
            sword.unequip = function (item, game) {
                return false;
            }

            character.equipment.rightHand = sword;

            const newSword = Sword();
            const result = service.equipItem(character, newSword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBe(sword);
        });

        test("should block equipping a new two-handed item when an existing item cannot be unequipped", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: null,
                    leftHand: null
                },
                items: []
            };

            const service = getService();
            const sword = Sword();

            sword.unequip = function (character, item, game) {
                return false;
            };

            character.equipment.rightHand = sword;

            const twoHandedSword = <IItem>{
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ],
                usesMultipleSlots: true
            };

            const result = service.equipItem(character, twoHandedSword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBe(sword);
            expect(character.equipment.leftHand).toBeNull();
        });

        test("should block equipping a new item when an existing two-handed item cannot be unequipped", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: null
                },
                items: []
            };

            const service = getService();

            const twoHandedSword = <IItem>{
                equipmentType: [
                    EquipmentType.RightHand,
                    EquipmentType.LeftHand
                ],
                unequip: function (character, item, game) {
                    return false;
                }
            };

            const sword = Sword();

            character.equipment.rightHand = twoHandedSword;
            character.equipment.leftHand = twoHandedSword;

            const result = service.equipItem(character, sword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBe(twoHandedSword);
            expect(character.equipment.leftHand).toBe(twoHandedSword);
        });

        test("should block equipping an item which disallows equipping", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: null
                }
            };

            const service = getService();

            const sword = Sword();
            sword.equip = function (character, item, game) {
                return false;
            }

            const result = service.equipItem(character, sword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBeNull();
        });

        test("should move an equipped item back to the backpack when equipping an item of the same type", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const service = getService();
            const equippedBoots = LeatherBoots();
            const backPackBoots = LeatherBoots();
            character.equipment.feet = equippedBoots;
            character.items.push(backPackBoots);
            service.equipItem(character, backPackBoots);

            expect(character.equipment.feet).not.toBeNull();
            expect(character.equipment.feet).toBe(backPackBoots);

            expect(character.items.length).toBe(1);
            expect(character.items[0]).toBe(equippedBoots);
        });

        test("should equip an item that can use multiple slots to it's preferred slot when available", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const service = getService();
            const backPackDagger = daggerFunc();
            character.items.push(backPackDagger);
            service.equipItem(character, backPackDagger);

            expect(character.equipment.rightHand).not.toBeNull();
            expect(character.equipment.rightHand).toBe(backPackDagger);

            expect(character.items.length).toBe(0);
        });

        test("should equip an item that can use multiple slots to a free slot when one slot is taken", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const service = getService();
            const equippedSword = Sword();
            const backPackDagger = daggerFunc();
            character.equipment.rightHand = equippedSword;
            character.items.push(backPackDagger);
            service.equipItem(character, backPackDagger);

            expect(character.equipment.rightHand).not.toBeNull();
            expect(character.equipment.rightHand).toBe(equippedSword);

            expect(character.equipment.leftHand).not.toBeNull();
            expect(character.equipment.leftHand).toBe(backPackDagger);

            expect(character.items.length).toBe(0);
        });

        test("should move an equipped item back to the backpack when equipping an item that can use the" +
            "same slot and no other slots are available", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const service = getService();
            const equippedSword = Sword();
            const equippedDagger = daggerFunc();
            const backPackDagger = daggerFunc();
            character.equipment.rightHand = equippedSword;
            character.equipment.leftHand = equippedDagger;
            character.items.push(backPackDagger);
            service.equipItem(character, backPackDagger);

            expect(character.equipment.rightHand).not.toBeNull();
            expect(character.equipment.rightHand).toBe(equippedSword);

            expect(character.equipment.leftHand).not.toBeNull();
            expect(character.equipment.leftHand).toBe(backPackDagger);

            expect(character.items.length).toBe(1);
            expect(character.items[0]).toBe(equippedDagger);
        });

        test("should unequip only the slot that an item that can use multiple slots is actually occupying", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const service = getService();
            const equippedSword = Sword();
            const equippedDagger = daggerFunc();
            character.equipment.rightHand = equippedSword;
            character.equipment.leftHand = equippedDagger;
            service.unequipItem(character, equippedDagger);

            expect(character.equipment.rightHand).not.toBeNull();
            expect(character.equipment.rightHand).toBe(equippedSword);

            expect(character.equipment.leftHand).toBeNull();

            expect(character.items.length).toBe(1);
            expect(character.items[0]).toBe(equippedDagger);
        });

        test("should block equipping an item when game rules disallow it", function () {
            const character = <ICharacter>{
                equipment: {
                    rightHand: null
                },
                items: []
            };

            const rules = {
                character: {
                    beforeEquip: function (game, character, item) {
                        return false;
                    }
                }
            }

            const service = getService({}, rules);
            const sword = Sword();

            const result = service.equipItem(character, sword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBeNull();
        });

        test("should block unequipping an item when game rules disallow it", function () {
            const character = <ICharacter>{
                equipment: <any>{},
                items: []
            };

            const rules = {
                character: {
                    beforeUnequip: function (game, character, item) {
                        return false;
                    }
                }
            }

            const service = getService({}, rules);
            const sword = Sword();
            character.equipment.rightHand = sword;

            const result = service.unequipItem(character, sword);

            expect(result).toBeFalsy();
            expect(character.equipment.rightHand).toBe(sword);
        });
    });

    describe("backpack", function () {

        test("should drop an item the character has in his backpack", function () {
            const sword = Sword();

            const character = <ICharacter>{
                items: [
                    sword
                ]
            };

            const game = <IGame>{
                currentLocation: {
                    items: []
                }
            };

            const service = getService(game);
            service.dropItem(character, sword);

            expect(character.items.length).toBe(0);
            expect(game.currentLocation.items.length).toBe(1);
            expect(game.currentLocation.items[0]).toBe(sword);
        });
    });

    describe("Group items", function () {

        test("items of the same type should be groupable", function () {
            const daggerA = daggerFunc();
            const daggerB = daggerFunc();

            const character = {
                items: [
                    daggerA,
                    daggerB
                ]
            };

            const service = getService();
            const result = service.canGroupItem(<any>character, daggerA, daggerB);
            expect(result).toBeTruthy();
        });

        test("items of different types should NOT be groupable", function () {
            const daggerA = daggerFunc();
            const sword = <IGroupableItem>Sword();
            sword.id = 'sword';
            sword.isGroupable = true;

            const character = {
                items: [
                    daggerA,
                    sword
                ]
            };

            const service = getService();
            const result = service.canGroupItem(<any>character, daggerA, sword);
            expect(result).toBeFalsy();
        });

        test("items of different types that may be grouped together should be groupable", function () {
            const daggerA = daggerFunc();
            daggerA.groupTypes = ['sword']
            const sword = <IGroupableItem>Sword();
            sword.id = 'sword';
            sword.isGroupable = true;

            const character = {
                items: [
                    daggerA,
                    sword
                ]
            };

            const service = getService();
            const result = service.canGroupItem(<any>character, daggerA, sword);
            expect(result).toBeTruthy();
        });
        
        test("eligible items should be grouped", function () {
            const daggerA = daggerFunc();
            const daggerB = daggerFunc();

            const character = {
                items: [
                    daggerA,
                    daggerB
                ]
            };
            
            const service = getService();
            service.groupItem(<any>character, daggerA, daggerB);
            expect(daggerA.members).toHaveLength(1);
            expect(daggerA.members[0]).toBe(daggerB);
        });
        
    });

    test("should call the use function on an item", function () {
        let used = false;
        const character = <ICharacter>{};

        const item = <IItem>{
            use: (game: IGame, character: ICharacter, item: IItem) => {
                used = true;
            }
        };

        const service = getService();
        service.useItem(character, item);

        expect(used).toBeTruthy();
    });
});

const daggerFunc = (): IGroupableItem => {
    return {
        id: 'dagger',
        name: 'Dagger',
        equipmentType: [EquipmentType.RightHand, EquipmentType.LeftHand],
        isGroupable: true,
        groupName: "{0} daggers"
    }
}

function getService(game?: any, rules?: any, texts?: IInterfaceTexts) {
    return new ItemService(game || {}, rules || Rules(), texts || new DefaultTexts());
}