import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './LongSword.html';

export function LongSword() {
    return Item({
        name: 'Long Sword',
        description: description,
        speed: 4,
        damage: '1D6',
        isWeapon: true,
        equipmentType: EquipmentType.RightHand,
        value: 5,
        attackText: '{0} swings the longsword',
        itemClass: ClassType.Warrior
    });
}