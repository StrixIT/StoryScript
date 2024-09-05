import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Dodge2.html?raw';

export function Dodge2() {
	return Item({
		name: 'Dodge2',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
	});
}