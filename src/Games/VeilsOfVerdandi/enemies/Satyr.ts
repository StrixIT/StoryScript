import { IGame, Enemy } from '../types';
import description from './Satyr.html?raw';
import {ClassType} from "../classType.ts";

export function Satyr() {
	return Enemy({
		name: 'Satyr',
		description: description,
		hitpoints: 15,
		defence: 3,
		currency: 10,
		attacks: [
			{
				damage: '1d4+1',
				speed: 3,
				attackPriority: [
					[ClassType.Rogue, [1,2,3,4]],
					[ClassType.Wizard, [5,6]]
				],
			}
		],
	});
}