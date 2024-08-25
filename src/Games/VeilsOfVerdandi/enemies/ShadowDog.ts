import { IGame, Enemy } from '../types';
import description from './ShadowDog.html?raw';

export function ShadowDog() {
	return Enemy({
		name: 'ShadowDog',
		description: description,
		hitpoints: 10,
		items: [
		],
	});
}