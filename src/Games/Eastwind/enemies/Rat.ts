import { IGame, Enemy } from '../types';
import description from './Rat.html';

export function Rat() {
	return Enemy({
		name: 'Rat',
		description: description,
		hitpoints: 10,
		items: [
		],
	});
}