import { Item, EquipmentType, TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './LongSword.html?raw';
import { Constants } from '../constants';

export function LongSword() {
    return Item({
        name: 'Long Sword',
        description: description,
        speed: 4,
        damage: '1D6',
        equipmentType: Constants.PrimaryWeapon,
        value: 5,
        targetType: TargetType.Enemy,
        attackText: '{0} swings the longsword',
        itemClass: ClassType.Warrior
    });
}