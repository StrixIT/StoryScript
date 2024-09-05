import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './PowerAttack2.html?raw';

export function PowerAttack2() {
	return Item({
		name: 'PowerAttack2',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
	});
}