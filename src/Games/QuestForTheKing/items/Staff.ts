import { IGame, Item } from '../types';
import { EquipmentType, TargetType } from 'storyScript/Interfaces/storyScript';
import description from './Staff.html';
import { ClassType } from '../classType';
import { Constants } from '../constants';

export function Staff() {
	return Item({
		name: 'Staff',
		damage: '1d4',
		description: description,
		equipmentType: Constants.PrimaryWeapon,
		value: 15,
		targetType: TargetType.Enemy,
        attackText: '{0}} swings the staff',
        itemClass: [ ClassType.Wizard ]
	});
}