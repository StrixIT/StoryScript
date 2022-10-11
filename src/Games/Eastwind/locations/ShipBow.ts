import { Adventurers } from '../persons/Adventurers';
import { IGame, Location } from '../types';
import description from './ShipBow.html';
import { Shipsdeck } from './shipsdeck';

export function ShipBow() {
	return Location({
		name: 'ShipBow',
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
			Adventurers()
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