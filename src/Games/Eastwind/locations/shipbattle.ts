import { IGame, Location } from '../types';
import description from './shipbattle.html';
import { ShipStern } from './shipStern';

export function Shipbattle() {
	return Location({
		name: 'Shipbattle',
		description: description,
		destinations: [
			{
				name: 'Continue...',
				target: ShipStern,
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
		],
		combatActions: [
		],
	});
}