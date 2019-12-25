import { IGame, Location } from '../../types';
import description from './next.html';
import { Next2 } from './Next2';

export function Next() {
	return Location({
		name: 'Intro',
		description: description,
		destinations: [
			{
				name: 'Continue',
				target: Next2,
			}
			
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