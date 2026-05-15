import { IGame, Location } from '../types';
import description from './FleeOnFoot.html?raw';

export function FleeOnFoot() {
	return Location({
		name: 'Fleeing on foot',
		description: description,
		destinations: [
			
		]
	});
}