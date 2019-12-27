import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Leatherarmor() {
    return Item({
        name: 'Leather Armor',
        damage: '2',
        equipmentType: EquipmentType.Body,
        dayAvailable: 1,
        arcane: false,
        value: 10,
        itemClass: [Class.Rogue, Class.Warrior]
    });
}