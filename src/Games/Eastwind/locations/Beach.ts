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