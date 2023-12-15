import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Leatherboots.html';

export function Leatherboots() {
    return Item({
        name: 'Leather Boots',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Feet,
        dayAvailable: 1,
        arcane: false,
        value: 5,
        itemClass: [ClassType.Rogue, ClassType.Warrior, ClassType.Wizard]
    });
}