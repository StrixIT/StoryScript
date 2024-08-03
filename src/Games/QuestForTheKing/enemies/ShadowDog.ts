import { IGame, Enemy } from '../types';
import description from './ShadowDog.html';

export function ShadowDog() {
	return Enemy({
		name: 'ShadowDog',
		description: description,
		hitpoints: 10,
		items: [
		],
	});
}