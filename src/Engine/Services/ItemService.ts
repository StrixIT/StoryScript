import {IItemService} from "storyScript/Interfaces/services/itemService.ts";
import {IGame} from "storyScript/Interfaces/game.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IInterfaceTexts} from "storyScript/Interfaces/interfaceTexts.ts";
import { IItem } from "storyScript/Interfaces/item";
import {IGroupableItem} from "storyScript/Interfaces/groupableItem.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {EquipmentType} from "storyScript/Interfaces/enumerations/equipmentType.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {removeItemFromItemsAndEquipment} from "storyScript/Services/sharedFunctions.ts";
import {getEquipmentType} from "storyScript/utilityFunctions.ts";

export class ItemService implements IItemService {

    constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
    }

    getItemName = (item: IItem): string => {
        if (!item) {
            return undefined;
        }
        
        if (this._rules.general.getItemName) {
            return this._rules.general.getItemName(item);
        }
        
        const groupableItem = item as IGroupableItem<IItem>
        
        if (!groupableItem.members?.length) {
            return item.name;
        }
        
        return this._texts.format(groupableItem.groupName, [(groupableItem.members.length + 1).toString()]);
    }

    pickupItem = (character: ICharacter, item: IItem): boolean => {
        const isCombining = this._game.combinations?.activeCombination;

        if (isCombining) {
            this._game.combinations.tryCombine(item)
            return false;
        }

        if (this._rules.character.beforePickup && !this._rules.character.beforePickup(this._game, character, item)) {
            return false;
        }

        this._game.currentLocation.items.delete(item);
        character.items.add(item);

        return true;
    }

    canGroupItem = (character: ICharacter, group: IGroupableItem<IItem>, item: IGroupableItem<IItem>): boolean => {
        if (!item || !item.isGroupable || item.members?.length) {
            return false;
        }

        if (group) {
            if (!group.isGroupable) {
                return false;
            }

            if ((group.members?.length ?? 0) >= group.maxSize - 1) {
                return false;
            }
    
            if (group.id !== item.id && (!group.groupTypes || group.groupTypes.indexOf(item.id) === -1)) {
                return false;
            }
        }
        
        const anyGroupableItem = character.items.find(i => {
            if (i === item) {
                return false;
            }

            const groupable = i as IGroupableItem<IItem>;
            return groupable.isGroupable && (!groupable.maxSize || ((groupable.members?.length ?? 0) < groupable.maxSize - 1))
        });
        
        if (!anyGroupableItem) {
            return false;
        }
        
        if (this._rules.general.canGroupItem) {
            return this._rules.general.canGroupItem(character, group, item);
        }

        return true;
    };
    
    groupItem = (character: ICharacter, group: IGroupableItem<IItem>, item: IGroupableItem<IItem>): boolean => {
        if (group && group !== item) {
            group.members ??= [];
            group.members.add(item);
            character.items.delete(item);
            return true;
        }
        
        return false;
    }

    splitItemGroup = (character: ICharacter, item: IGroupableItem<IItem>): void => {
        if (item?.members?.length > 0) {
            item.members.forEach((item: IItem) => {
                character.items.add(item);
            });
            
            item.members = undefined;
        }
    }

    useItem = (character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void => {
        const useItem = (this._rules.exploration?.onUseItem?.(this._game, character, item) && item.use) ?? item.use;

        if (useItem) {
            const promise = item.use(this._game, character, item, target);

            return Promise.resolve(promise).then(() => {
                if (item.charges !== undefined) {
                    if (!isNaN(item.charges)) {
                        item.charges--;
                    }

                    if (item.charges <= 0) {
                        removeItemFromItemsAndEquipment(character, item);
                    }
                }
            });
        }
    }

    isEquippable = (item: IItem, character?: ICharacter): boolean => {
        if (item.equipmentType === EquipmentType.Miscellaneous) {
            return false;
        }
        
        if (this._rules.character.canEquip) {
            return this._rules.character.canEquip(item, character);
        }
        
        return true;
    };

    equipItem = (character: ICharacter, item: IItem): boolean => {
        const equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        const slotsAvailable = this.makeSlotAvailable(character, item, equipmentTypes);

        if (slotsAvailable.length === 0) {
            return false;
        }

        if (this._rules.character.beforeEquip) {
            if (!this._rules.character.beforeEquip(this._game, character, item)) {
                return false;
            }
        }

        if (item.equip) {
            if (!item.equip(character, item, this._game)) {
                return false;
            }
        }

        for (const n in slotsAvailable) {
            character.equipment[slotsAvailable[n]] = item;
        }

        character.items.splice(character.items.indexOf(item), 1);
        return true;
    }

    unequipItem = (character: ICharacter, item: IItem): boolean => {
        return this.unequip(character, item);
    }

    canDrop = (item: IItem): boolean => {
        let canDrop: boolean;

        if (typeof item.canDrop === 'function') {
            canDrop = item.canDrop(this._game, item);
        } else if (typeof item.canDrop === 'undefined') {
            canDrop = true;
        } else {
            canDrop = item.canDrop;
        }

        return canDrop
    };
    
    dropItem = (character: ICharacter, item: IItem): void => {
        if (!item) {
            return;
        }

        let drop = true;

        if (this._rules.character.beforeDrop) {
            drop = this._rules.character.beforeDrop(this._game, character, item);
        }

        if (drop) {
            character.items.delete(item);
            this._game.currentLocation.items.add(item);
        }
    }

    private makeSlotAvailable(character: ICharacter, item: IItem, equipmentTypes: EquipmentType[]): string[] {
        if (!item.usesMultipleSlots) {
            return this.findAvailableSlot(character, equipmentTypes);
        }

        const availableSlots: string[] = [];

        for (const n in equipmentTypes) {
            const type = getEquipmentType(equipmentTypes[n]);
            const slotItem = character.equipment[type];

            if (slotItem) {
                const unequipped = this.unequip(character, slotItem);

                if (!unequipped) {
                    return [];
                }
            }

            availableSlots.push(type);
        }

        return availableSlots;
    }

    private findAvailableSlot(character: ICharacter, equipmentTypes: EquipmentType[]) {
        // If the item uses only one of the slots specified, see if a slot is available first.
        const occupiedSlots: string[] = [];
        const emptySlots: string[] = [];

        for (const n in equipmentTypes) {
            const type = getEquipmentType(equipmentTypes[n]);

            if (character.equipment[type]) {
                occupiedSlots.push(type);
            } else {
                emptySlots.push(type);
            }
        }

        if (emptySlots.length === 0) {
            const slotToUnequip = occupiedSlots[occupiedSlots.length - 1];
            const unequipped = this.unequip(character, character.equipment[slotToUnequip]);
            return !unequipped ? [] : [slotToUnequip];
        }

        return [emptySlots[0]];
    }

    private unequip = (character: ICharacter, equippedItem: IItem): boolean => {
        if (!equippedItem) {
            return true;
        }

        if (this._rules.character.beforeUnequip) {
            if (!this._rules.character.beforeUnequip(this._game, character, equippedItem)) {
                return false;
            }
        }

        if (equippedItem.unequip) {
            if (!equippedItem.unequip(character, equippedItem, this._game)) {
                return false;
            }
        }

        if (equippedItem?.equipmentType && character.items.indexOf(equippedItem) < 0) {
            character.items.push(equippedItem);
        }

        const slotsToUnEquip = Array.isArray(equippedItem.equipmentType)
            ? equippedItem.equipmentType
            : [equippedItem.equipmentType];

        slotsToUnEquip.forEach(t => {
            const itemType = getEquipmentType(t);
            const slotItem = character.equipment[itemType];
            character.equipment[itemType] = slotItem === equippedItem ? null : slotItem;
        });

        return true;
    }
}