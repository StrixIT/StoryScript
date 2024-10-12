import {Item} from '../types';
import {TargetType} from 'storyScript/Interfaces/storyScript';
import description from './ShortBow.html?raw';
import {ClassType} from '../classType';
import {Constants} from '../constants';

export function ShortBow() {
    return Item({
        name: 'Short Bow',
        description: description,
        damage: '1d4',
        speed: 5,
        equipmentType: Constants.Bow,
        targetType: TargetType.Enemy,
        ranged: true,
        attackText: '{0} shoots the Short Bow',
        itemClass: [ClassType.Rogue]
    });
}