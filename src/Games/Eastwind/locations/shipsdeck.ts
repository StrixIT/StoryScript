import { Vigga } from '../persons/Vigga';
import { IGame, Location } from '../types';
import { ShipBow } from './ShipBow';
import description from './shipsdeck.html';
import { ShipStern } from './shipStern';
export function Shipsdeck() {
	return Location({
		name: 'Shipsdeck',
		description: description,
		background_class: 'gradient-ship-outside',
		destinations: [  
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
			Vigga()
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