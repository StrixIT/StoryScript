import { Item } from '../types';
import { TargetType } from 'storyScript/Interfaces/storyScript';
import description from './ShortBow.html?raw';
import { ClassType } from '../classType';
import { Constants } from '../constants';

export function QualityBow() {
	return Item({
		name: 'Quality Bow',
		description: description,
		damage: '1d4+1',
		speed: 5,
		equipmentType: Constants.Bow,
		targetType: TargetType.Enemy,
		ranged: true,
		value: 35,
        attackText: '{0} shoots the Quality Bow',
        itemClass: [ ClassType.Rogue]
	});
}