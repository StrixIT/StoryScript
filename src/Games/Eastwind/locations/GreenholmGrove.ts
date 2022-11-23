import { IGame, Location } from '../types';
import description from './GreenholmGrove.html';

export function GreenholmGrove() {
	return Location({
		name: 'GreenholmGrove',
		description: description,
		destinations: [
			
		],
		features: [
		],
		items: [
		],
		enemies: [
		],
		persons: [
		],
		trade: [
		],
		enterEvents: [
		],
		leaveEvents: [
		],
		actions: [
			{
				text: 'Explore',
				execute: (game: IGame) => {
			},
			}
		],
		combatActions: [
		],
	});
}