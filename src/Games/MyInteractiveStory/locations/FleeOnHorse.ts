import { IGame, Location } from '../types';
import description from './FleeOnHorse.html?raw';

export function FleeOnHorse() {
	return Location({
		name: 'Fleeing on horseback',
		description: description,
		destinations: [
			
		]
	});
}