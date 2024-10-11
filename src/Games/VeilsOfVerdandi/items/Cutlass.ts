import {TargetType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './Cutlass.html?raw';
import {Constants} from '../constants';
import {Item} from '../types';

export function Cutlass() {
    return Item({
        name: 'Cutlass',
        description: description,
        damage: '1d6',
        speed: 5,
        equipmentType: Constants.PrimaryWeapon,
        value: 15,
        attackText: '{0} swings the Cutlass',
        itemClass: [ClassType.Warrior, ClassType.Rogue],
        targetType: TargetType.Enemy,
    });
}