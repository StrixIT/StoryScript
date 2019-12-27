import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Leatherboots() {
    return Item({
        name: 'Leather Boots',
        damage: '2',
        equipmentType: EquipmentType.Feet,
        dayAvailable: 1,
        arcane: false,
        value: 5,
        itemClass: [Class.Rogue, Class.Warrior, Class.Wizard]
    });
}