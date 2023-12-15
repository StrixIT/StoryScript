import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Roundshield.html';

export function Roundshield() {
    return Item({
        name: 'Round Shield',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.RightHand,
        dayAvailable: 2,
        arcane: false,
        value: 10,
        itemClass: ClassType.Warrior
    });
}