import { IGame, IItem, IPerson, Person } from '../types';
import description from './Merchant.html?raw';

export function Merchant() {
	return Person({
		name: 'Merchant',
		description: description,
		hitpoints: 10,
		items: [
		],
		quests: [
		],
		conversation: {
			actions: [
			]
		},
		trade: {
			name: 'Merchant\'s Inventory',
			text: 'I have been able to acquire some quality gear. Please check it out.',
			ownItemsOnly: true,
			buy: {
				text: 'Buy from the merchant',
				emptyText: '',
				itemSelector: (game: IGame, item: IItem): boolean => {
					return true;
				}
			},
			sell: {
				text: 'Sell to the merchant',
				emptyText: '',
				itemSelector: (game: IGame, item: IItem): boolean => {
					return true;
				}
			}
		},
	});
}