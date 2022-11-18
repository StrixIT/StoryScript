import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './firebolt.html';
import { Spell } from '../interfaces/spell';

export function Firebolt() {
	return Spell({
		name: 'Firebolt',
		description: description
	});
}