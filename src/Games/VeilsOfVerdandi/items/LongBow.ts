import { ClassType } from '../classType';
import description from './LongBow.html?raw';
import { Constants } from '../constants';
import { Item } from '../types';
import { TargetType } from '../../../Engine/Interfaces/storyScript';

export function Bow() {
    return Item({
        name: 'Long Bow',
        description: description,
        damage: '1d6',
        speed: 7,
        equipmentType: Constants.Bow,
        ranged: true,
        value: 35,
        attackText: '{0}} shoots the Long Bow',
        itemClass: [ClassType.Rogue],
        targetType: TargetType.Enemy
    });
}