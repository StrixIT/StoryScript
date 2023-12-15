import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './LeatherArmor.html';

export function LeatherArmor() {
    return Item({
        name: 'Leather Armor',
        description: description,
        defence: 1,
        equipmentType: EquipmentType.Body,
        value: 10,
        itemClass: [ClassType.Rogue, ClassType.Warrior]
    });
}