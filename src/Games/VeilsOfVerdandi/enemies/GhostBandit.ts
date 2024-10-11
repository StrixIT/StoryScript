import { ClassType } from '../classType';
import {IGame, Enemy, Character} from '../types';
import description from './GhostBandit.html?raw';

export function GhostBandit() {
	return Enemy({
		name: 'Ghost bandit',
		description: description,
        hitpoints: 15,
        defence: 4,
        currency: 4,
        attacks: [
            {
                damage: '1d4',
                isMagic: true,
                damageSpecial(game: IGame, character: Character) {
                    character.frozen = true;
                },
                speed: 3,
                attackPriority: [
                    [ClassType.Wizard, [1,2,3,4]],
                    [ClassType.Rogue, [5,6]]
                ]
            }  
        ],
		activeNight: true
	});
}