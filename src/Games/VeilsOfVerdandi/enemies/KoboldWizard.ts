import {Character, Enemy, IEnemy, IGame} from "../types";
import {check} from "../sharedFunctions.ts";
import {ClassType} from "../classType.ts";
import {damageSpecial} from "../combatRules.ts";

export function KoboldWizard() {
    return Enemy({
        name: 'Kobold Wizard',
        hitpoints: 30,
        defence: 3,
        currency: 25,
        attacks: [
            {
                damage: '1d6',
                speed: 4,
                attackPriority: [
                    [ClassType.Warrior, [1, 2, 3, 4]],
                    [ClassType.Rogue, [5, 6]]
                ]
            },
            {
                damage: '1d4',
                isMagic: true,
                speed: 7,
                damageSpecial: (game: IGame, enemy: IEnemy, character: Character) => damageSpecial(game, enemy, character, 'confused', 4),
                attackPriority: [
                    [ClassType.Wizard, [1, 2, 3, 4]],
                    [ClassType.Wizard, [5, 6]]
                ]
            }
        ],
        onDefeat(game: IGame) {
            // Todo: won the game!
        }
    });
}