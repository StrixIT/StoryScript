import { IGame, Location } from '../types';
import description from './ShipsholdFront.html';

export function ShipsholdFront() {
	return Location({
		name: 'ShipsholdFront',
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
				text: 'Investigate the shadow',
				execute: (game: IGame) => {	
					game.currentLocation.description = game.currentLocation.descriptions['investigate-shadow'];
			},
			}
		],
		combatActions: [
		],
	});
}