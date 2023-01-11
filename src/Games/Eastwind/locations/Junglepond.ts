import { IGame, Location } from '../types';
import description from './Junglepond.html';

export function Junglepond() {
	return Location({
		name: 'Junglepond',
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
				text: 'Approach the Pond',
				execute: (game: IGame) => {	
					game.currentLocation.description = game.currentLocation.descriptions['Approach the Pond'];
				
			},
			}
		],
		combatActions: [
		],
	});
}