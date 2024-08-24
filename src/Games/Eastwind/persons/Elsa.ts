import { Shipbattle } from '../locations/shipbattle';
import { IGame, Person } from '../types';
import description from './Elsa.html?raw';

export function Elsa() {
	return Person({
		name: 'Elsa',
		description: description,
		picture: 'resources/Elsa.png',
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		canAttack: false,
		conversation: {
			actions: [
				['goToCombat', (game: IGame) => game.changeLocation(Shipbattle)]
			]
		},
	});
}