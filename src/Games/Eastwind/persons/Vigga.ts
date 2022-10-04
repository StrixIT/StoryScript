import { IGame, IPerson, Person } from '../types';
import description from './Vigga.html';

export function Vigga() {
	return Person({
		name: 'Vigga',
		description: description,
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		canAttack: false,
		conversation: {
			actions: {
			}
		},
	});
}