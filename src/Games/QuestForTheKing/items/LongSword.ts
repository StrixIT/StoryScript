import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Longsword.html';

export function LongSword() {
    return Item({
        name: 'Long Sword',
        description: description,
        speed: 4,
        damage: '1D6',
        equipmentType: EquipmentType.RightHand,
        value: 5,
        attackText: 'You swing your longsword',
        itemClass: ClassType.Warrior
    });
}