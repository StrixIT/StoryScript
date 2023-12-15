import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Leatherarmor.html';

export function Leatherarmor() {
    return Item({
        name: 'Leather Armor',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Body,
        dayAvailable: 1,
        arcane: false,
        value: 10,
        itemClass: [ClassType.Rogue, ClassType.Warrior]
    });
}