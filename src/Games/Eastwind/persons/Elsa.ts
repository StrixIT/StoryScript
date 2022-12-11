import { IGame, IPerson, Person } from '../types';
import description from './Elsa.html';

export function Elsa() {
	return Person({
		name: 'Elsa',
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