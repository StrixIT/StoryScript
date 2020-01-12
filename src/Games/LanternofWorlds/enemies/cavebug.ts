import { IGame, Enemy } from '../types';
import description from './cavebug.html';

export function Cavebug() {
	return Enemy({
		name: 'Cavebug',
		description: description,
		picture: 'resources/CaveBug.png',
		hitpoints: 10,
		items: [
		],
	});
}