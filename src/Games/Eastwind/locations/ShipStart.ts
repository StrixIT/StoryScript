import { IGame, Location } from '../types';
import { ShipBow } from './ShipBow';
import { Shipsdeck } from './shipsdeck';
import description from './ShipStart.html';
import { ShipStern } from './shipStern';

export function ShipStart() {
	return Location({
		name: 'ShipStart',
		description: description,
		destinations: [
			{
				name: 'Look around',
				target: Shipsdeck, 
			  },    
			  {
				name: 'Go to the back of the ship',
				target: ShipStern,
			  },
			  {
				name: 'Go to the front of the ship',
				target: ShipBow, 
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