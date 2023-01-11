import { Constants } from '../constants';
import { Flask } from '../items/flask';
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
			{
				name: 'banana',
				combinations: {
					combine: [
						{
							combinationType: Constants.LOOKAT,
							match: (game, target, tool): string => {
								return 'A fresh looking banana.';

			                  }
		                   },
						{
							combinationType: Constants.TAKE,
							match: (game, target, tool): string => {
								return 'You take the banana';

			                  }
		                },
					]
				}
				

			},
			{
				name: 'chest',
				combinations: {
					combine: [
						{
							combinationType: Constants.LOOKAT,
							match: (game, target, tool): string => {
								return 'A sturdy looking chest.';

			                  }
		                   },
					
					]
				}
				

			}
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
				text: 'Look around',
				execute: (game: IGame) => {	
					game.currentLocation.description = game.currentLocation.descriptions['Look around'];

			},
		}
		],
		combatActions: [
		],
	});
}