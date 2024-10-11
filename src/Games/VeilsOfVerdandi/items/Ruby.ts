import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Ruby.html?raw';

export function Ruby() {
	return Item({
		name: 'Ruby',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
		value: 30,
	});
}