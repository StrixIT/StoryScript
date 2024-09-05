import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './PowerAttack1.html?raw';

export function PowerAttack1() {
	return Item({
		name: 'PowerAttack1',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
	});
}