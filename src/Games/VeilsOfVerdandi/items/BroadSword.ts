import { ClassType } from '../classType';
import description from './BroadSword.html?raw';
import { Constants } from '../constants';
import { Item } from '../types';
import { TargetType } from '../../../Engine/Interfaces/storyScript';

export function BroadSword() {
    return Item({
        name: 'Broad Sword',
        description: description,
        damage: '1d8',
        speed: 6,
        equipmentType: Constants.PrimaryWeapon,
        value: 25,
        attackText: '{0}} swings the Broad Sword',
        itemClass: [ ClassType.Warrior ],
        targetType: TargetType.Enemy,
    });
}