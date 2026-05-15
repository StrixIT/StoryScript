import { IGame, Location } from '../types';
import description from './GrabSword.html?raw';
import {Start} from "./Start.ts";

export function GrabSword() {
	return Location({
		name: 'Ready to fight',
		description: description,
		destinations: [
			{
				name: 'Read from the beginning',
				target: Start
			}
		]
	});
}