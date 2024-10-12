import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './SmallDiamond.html?raw';

export function SmallDiamond() {
	return Item({
		name: 'Small Diamond',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
		value: 15
	});
}