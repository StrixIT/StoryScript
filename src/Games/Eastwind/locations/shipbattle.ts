import { IGame, Location } from '../types';
import description from './shipbattle.html';
import { ShipStern } from './shipStern';
import { Waterworld } from './Waterworld';

export function Shipbattle() {
	return Location({
		name: 'Shipbattle',
		description: description,
		destinations: [
			{
				name: 'Continue...',
				target: Waterworld,
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