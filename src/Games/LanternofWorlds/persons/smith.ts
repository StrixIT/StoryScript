import { IGame, IPerson, Person, IItem } from '../types';
import description from './smith.html';

export function Smith() {
	return Person({
		name: 'Smith',
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
			title: 'Smithy',
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