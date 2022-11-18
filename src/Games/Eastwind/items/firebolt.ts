import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './firebolt.html';

export function Firebolt() {
	return Item({
		name: 'Firebolt',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
		isSpell: true
	});
}