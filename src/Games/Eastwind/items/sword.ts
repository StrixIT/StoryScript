import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './sword.html';

export function Sword() {
	return Item({
		name: 'Sword',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
		attackText: 'You swing your sword',
		attackSound: 'swing3.wav'
	});
}