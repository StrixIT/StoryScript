import { IGame, Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './sword.html';

export function Sword() {
	return Item({
		name: 'Sword',
		description: description,
		equipmentType: EquipmentType.RightHand,
		attackText: 'You swing your sword',
		attackSound: 'swing3.wav',
		attackImage: 'Slash.gif'
	});
}