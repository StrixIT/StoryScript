import { Constants } from '../constants';
import { IGame, Location } from '../types';
import description from './Beach.html';
import { Junglestart } from './junglestart';

export function Beach() {
	return Location({
		name: 'Beach',
		description: description,
		destinations: [
			{
				name: 'Enter the Jungle',
				target: Junglestart,
			  },
			
			
		],
		features: [
			{
				name: 'palmtree',
				combinations: {
					combine: [
						{
							combinationType: Constants.LOOKAT,
							match: (game, target, tool): string => {
								return 'A palmtree rises from the sand of the beach. Within its crown, you spot several coconuts.';

			                  }
		                   },
						{
							combinationType: Constants.USE,
							match: (game, target, tool): string => {
								return 'You might be able to climb the palmtree. Do you wish to try?';

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
		],
		combatActions: [
		],
	});
}