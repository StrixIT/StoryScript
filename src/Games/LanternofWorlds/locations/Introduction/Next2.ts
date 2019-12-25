import { IGame, Location } from '../../types';
import description from './next2.html';

export function Next2() {
	return Location({
		name: 'Intro',
		description: description,
		destinations: [
			{
				name: 'Start your adventure',
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