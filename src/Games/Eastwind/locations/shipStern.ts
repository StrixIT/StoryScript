import { IGame, Location } from '../types';
import { Shipsdeck } from './shipsdeck';
import description from './shipStern.html';

export function ShipStern() {
	return Location({
		name: 'ShipStern',
		description: description,
		destinations: [
			{
				name: 'Go to the center of the ship',
				target: Shipsdeck,
			  },
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
				text: 'Open the hatch',
				execute: (game: IGame) => {
					
				},
			},
		],
		combatActions: [
		],
	});
}