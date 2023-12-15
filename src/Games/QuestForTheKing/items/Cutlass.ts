import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Cutlass.html';

export function Claymore() {
    return Item({
        name: 'Cutlass',
        description: description,
        damage: '1d6',
        speed: 5,
        equipmentType: EquipmentType.RightHand,
        value: 30,
        attackText: 'You swing your cutlass',
        itemClass: [ClassType.Warrior, ClassType.Rogue]
    });
}