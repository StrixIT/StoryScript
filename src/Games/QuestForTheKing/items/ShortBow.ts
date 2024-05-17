import { IGame, Item } from '../types';
import { EquipmentType, TargetType } from 'storyScript/Interfaces/storyScript';
import description from './ShortBow.html';
import { ClassType } from '../classType';
import { Constants } from '../constants';

export function ShortBow() {
	return Item({
		name: 'ShortBow',
		description: description,
		damage: '2',
		equipmentType: Constants.Bow,
		targetType: TargetType.Enemy,
		arcane: false,
		ranged: true,
		value: 15,
        attackText: '{0} shoots the short bow',
        itemClass: [ ClassType.Rogue, ClassType.Warrior ]
	});
}