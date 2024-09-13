import { ClassType } from '../classType';
import { IGame, Enemy } from '../types';
import description from './GhostBandit.html?raw';

export function GhostBandit() {
	return Enemy({
		name: 'Ghost bandit',
		description: description,
		// Todo: damage is magic damage and also does freeze.
        damage: '1d4',
        defence: 4,
        speed: 3,
        hitpoints: 15,
        currency: 4,
        attackPriority: [
            [ClassType.Wizard, [1,2,3,4]],
            [ClassType.Rogue, [5,6]]
        ],
		activeNight: true
	});
}