import { IGame, IPerson, Person } from '../types';
import description from './Adventurers.html';

export function Adventurers() {
	return Person({
		name: 'Adventurers',
		description: description,
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		canAttack: false,
		conversation: {
		},
	});
}