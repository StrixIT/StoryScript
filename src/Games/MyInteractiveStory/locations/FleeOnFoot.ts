import { IGame, Location } from '../types';
import description from './FleeOnFoot.html?raw';
import {Start} from "./Start.ts";

export function FleeOnFoot() {
	return Location({
		name: 'Fleeing on foot',
		description: description,
		destinations: [
			{
			    name: 'Read from the beginning',
			    target: Start
			}
		]
	});
}