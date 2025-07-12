import { IGame, Location } from '../types';
import description from './Carinthia.html?raw';
import {Westphalia} from "./Westphalia.ts";
import {Start} from "./start.ts";

export function Carinthia() {
	return Location({
		name: 'Carinthia',
		description: description,
		destinations: [
			{
				name: 'Westphalia',
				target: Westphalia
			},
			{
				name: 'Franconia',
				target: Start
			},
		]
	});
}