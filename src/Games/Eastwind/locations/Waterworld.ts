import { IGame, Location } from '../types';
import { Beach } from './Beach';
import { Coralcastle } from './Coralcastle';
import description from './Waterworld.html';

export function Waterworld() {
	return Location({
		name: 'Waterworld',
		description: description,
		destinations: [
			{
				name: 'Continue...',
				target: Beach,
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