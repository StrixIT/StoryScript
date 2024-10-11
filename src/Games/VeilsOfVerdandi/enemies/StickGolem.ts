import { IGame, Enemy } from '../types';
import description from './StickGolem.html?raw';
import {ClassType} from "../classType.ts";

export function StickGolem() {
	return Enemy({
		name: 'Stick Golem',
		description: description,
		hitpoints: 25,
		defence: 3,
		currency: 5,
		attacks: [
			{
				damage: '1d8',
				speed: 7,
				attackPriority: [
					[ClassType.Warrior, [1,2,3,4]],
					[ClassType.Wizard, [5,6]]
				],
			}
		],
		inactive: true
	});
}