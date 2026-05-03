import { IGame, IPerson, Person } from '../types';
import description from './Moser.html?raw';

export function Moser() {
	return Person({
		name: 'Moser',
		description: description,
		hitpoints: 10,
		canAttack: false,
		items: [
		],
		quests: [
		],
		conversation: {
			actions: [
			]
		},
	});
}
