import {Character, Enemy, IGame} from '../types';
import description from './ShadowDog.html?raw';
import {ClassType} from "../classType.ts";
import {check} from "../sharedFunctions.ts";

export function ShadowDog() {
    return Enemy({
        name: 'Shadow Dog',
        description: description,
        damage: '1d8',
        damageSpecial(game: IGame, character: Character) {
            if (!check(game, 3)) {
				character.frightened = true;
			}
        },
        defence: 3,
        speed: 4,
        hitpoints: 20,
        currency: 4,
        attackPriority: [
            [ClassType.Warrior, [1, 2, 3, 4]],
            [ClassType.Rogue, [5, 6]]
        ],
        activeNight: true
    });
}