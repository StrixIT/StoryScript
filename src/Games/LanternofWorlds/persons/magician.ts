import { IGame, IPerson, Person, IItem } from '../types';
import description from './magician.html';

export function Magician() {
	return Person({
		name: 'Magician',
		canAttack: false,
		description: description,
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		conversation: {
			actions: {
			}
		},
		trade: {
			title: 'Magic shop',
			description: '',
			ownItemsOnly: false,
			buy: {
				description: '',
				emptyText: '',
				itemSelector: (game: IGame, item: IItem): boolean => {
					return true;
				},
				maxItems: 2,
			},
			sell: {
				description: '',
				emptyText: '',
				itemSelector: (game: IGame, item: IItem): boolean => {
					return true;
				},
				maxItems: 2,
			}
		},
	});
}