import {Character, Enemy, IGame} from "../types";
import description from './Spectre.html?raw';
import {ClassType} from "../classType.ts";
import {check} from "../sharedFunctions.ts";

export function Spectre() {
    return Enemy({
        name: 'Spectre',
        description: description,
        damage: '1d4M',
        damageSpecial(game: IGame, character: Character) {
            if (!check(game, 4)) {
                character.frightened = true;
            }
        },
        defence: 4,
        speed: 5,
        hitpoints: 15,
        currency: 4,
        attackPriority: [
            [ClassType.Wizard, [1,2,3,4]],
            [ClassType.Warrior, [5,6]]
        ],
        activeNight: true
    });
}