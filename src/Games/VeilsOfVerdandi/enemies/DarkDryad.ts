import {Character, Enemy, IGame} from "../types";
import {ClassType} from "../classType.ts";

export function DarkDryad() {
    return Enemy({
        name: 'The Dark Dryad',
        hitpoints: 20,
        defence: 4,
        currency: 15,
        attacks: [
            {
                damage: '1d6',
                isMagic: true,
                damageSpecial(game: IGame, character: Character) {
                    character.frozen = true;
                },
                speed: 7,
                attackPriority: [
                    [ClassType.Wizard, [1, 2, 3, 4]],
                    [ClassType.Warrior, [5, 6]]
                ]
            }
        ]
    });
}