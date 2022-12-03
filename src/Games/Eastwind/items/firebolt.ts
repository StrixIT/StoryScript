import description from './firebolt.html';
import { Spell } from '../interfaces/spell';

export function Firebolt() {
	return Spell({
		name: 'Firebolt',
		description: description,
		equipmentType: 'Spell',
		attackText: 'You cast Firebolt...',
		attackSound: 'swing3.wav'
	}, '1d8',);
}