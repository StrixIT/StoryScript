import { IGame, Location } from '../types';
import description from './GrabSword.html?raw';

export function GrabSword() {
	return Location({
		name: 'Ready to fight',
		description: description,
		destinations: [
			
		]
	});
}