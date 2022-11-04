import { Pouch } from '../items/Pouch';
import { IGame, IPerson, Person } from '../types';
import description from './Dante.html';

export function Dante() {
	return Person({
		name: 'Dante',
		description: description,
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		canAttack: false,
		conversation: {
			actions: {'givePouch': (game, person) => {
				game.character.items.push(Pouch);
			}
			}
		},
	});
}