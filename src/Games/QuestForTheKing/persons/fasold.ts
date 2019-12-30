import { IGame, IPerson, Person } from '../types';
import description from './fasold.html';

export function Fasold() {
	return Person({
		name: 'Fasold',
		description: description,
		hitpoints: 10,
		canAttack: false,
		items: [
		],
		quests: [
		],
		conversation: {
			actions: {
			}
		},
	});
}