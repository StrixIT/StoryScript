import { IGame, Location } from '../types';
import description from './Westphalia.html?raw';
import {Carinthia} from "./Carinthia.ts";
import {Start} from "./start.ts";

export function Westphalia() {
	return Location({
		name: 'Westphalia',
		description: description,
		destinations: [
			{
				name: 'Franconia',
				target: Start
			},
			{
				name: 'Carinthia',
				target: Carinthia
			},
		]
	});
}