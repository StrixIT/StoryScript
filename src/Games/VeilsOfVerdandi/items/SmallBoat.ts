import { Key } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './SmallBoat.html?raw';

export function SmallBoat() {
	return Key({
		name: 'SmallBoat',
		description: description,
		equipmentType: EquipmentType.Miscellaneous,
		open: {
			text: 'Sail the ocean',
			execute(game, barrier, destination) {
				
			}
		},
		keepAfterUse: true
	});
}