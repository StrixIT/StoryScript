import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Staff.html';
import { ClassType } from '../classType';

export function Staff() {
	return Item({
		name: 'Staff',
		damage: '1d4',
		description: description,
		equipmentType: EquipmentType.RightHand,
		arcane: false,
		value: 15,
        attackText: 'You swing your staff',
        itemClass: [ ClassType.Wizard ]
	});
}