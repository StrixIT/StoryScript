import { IGame, Enemy } from '../types';
import description from './ShadowDog.html?raw';
import {ClassType} from "../classType.ts";

export function ShadowDog() {
	return Enemy({
		name: 'ShadowDog',
		description: description,
		// Todo: add fright
		damage: '1d8',
		defence: 3,
		speed: 4,
		hitpoints: 20,
		currency: 4,
		attackPriority: [
			[ClassType.Warrior, [1,2,3,4]],
			[ClassType.Rogue, [5,6]]
		],
		activeNight: true
	});
}