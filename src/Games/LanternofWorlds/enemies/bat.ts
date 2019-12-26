import { IGame, Enemy } from '../types';

export function Bat() {
	return Enemy({
		name: 'Bat',
		hitpoints: 10,
		items: [
		],
	});
}