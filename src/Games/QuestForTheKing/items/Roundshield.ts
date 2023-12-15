import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Roundshield.html';

export function Roundshield() {
    return Item({
        name: 'Round Shield',
        description: description,
        defence: 1,
        equipmentType: EquipmentType.RightHand,
        value: 10,
        itemClass: ClassType.Warrior
    });
}