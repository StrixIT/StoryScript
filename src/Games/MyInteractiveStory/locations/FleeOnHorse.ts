import { IGame, Location } from '../types';
import description from './FleeOnHorse.html?raw';
import {Start} from "./Start.ts";

export function FleeOnHorse() {
	return Location({
		name: 'Fleeing on horseback',
		description: description,
		destinations: [
			{
				name: 'Read from the beginning',
				target: Start
			}
		]
	});
}