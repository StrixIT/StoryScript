import { IGame, Location } from '../types';
import description from './shipsdeck.html';
export function Shipsdeck() {
	return Location({
		name: 'Shipsdeck',
		description: description,
		destinations: [ {
            name: 'Talk to Vigga',
            target: Shipsdeck, 
          },
          
      {
        name: 'Go to the back of the ship',
        target: null,
      },
      {
        name: 'Go to the front of the ship',
        target: null,
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