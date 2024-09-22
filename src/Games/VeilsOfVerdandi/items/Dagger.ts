import { TargetType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Dagger.html?raw';
import { Constants } from '../constants';
import { Item } from '../types';

export function Dagger() {
    return Item({
        name: 'Dagger',
        description: description,
        damage: '1d4',
        speed: 3,
        equipmentType: [Constants.PrimaryWeapon, Constants.SecondaryWeapon],
        value: 5,
        attackText: '{0} thrust the Dagger',
        itemClass: [ClassType.Rogue, ClassType.Warrior],
        targetType: TargetType.Enemy
    });
}