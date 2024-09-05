import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Dodge1.html?raw';

export function Dodge1() {
	return Item({
		name: 'Dodge1',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
	});
}