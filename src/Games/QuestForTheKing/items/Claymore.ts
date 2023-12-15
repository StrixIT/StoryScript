import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Claymore.html';

export function Claymore() {
    return Item({
        name: 'Claymore',
        description: description,
        damage: '2',
        equipmentType: [EquipmentType.LeftHand, EquipmentType.RightHand],
        dayAvailable: 3,
        arcane: false,
        value: 30,
        attackText: 'You swing your claymore',
        itemClass: ClassType.Warrior
    });
}