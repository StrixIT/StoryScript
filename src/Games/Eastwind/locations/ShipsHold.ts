import { IGame, Location } from '../types';
import description from './ShipsHold.html';
import { ShipsHoldAft } from './ShipsHoldAft';
import { ShipsholdFront } from './ShipsholdFront';

export function ShipsHold() {
	return Location({
		name: 'ShipsHold',
		description: description,
		destinations: [
			{
				name: 'Go to the aft of the hold',
				target: ShipsHoldAft
			  },
			  {
				name: 'Go to the front of the hold',
				target: ShipsholdFront
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