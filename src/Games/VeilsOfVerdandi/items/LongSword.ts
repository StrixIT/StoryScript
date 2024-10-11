import {TargetType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './LongSword.html?raw';
import {Constants} from '../constants';
import {Item} from '../types';

export function LongSword() {
    return Item({
        name: 'Long Sword',
        description: description,
        speed: 4,
        damage: '1D6',
        equipmentType: Constants.PrimaryWeapon,
        value: 15,
        targetType: TargetType.Enemy,
        attackText: '{0} swings the Long Sword',
        itemClass: ClassType.Warrior
    });
}