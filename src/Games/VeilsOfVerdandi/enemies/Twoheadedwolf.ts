import {Character, Enemy, IGame} from '../types';
import {ClassType} from "../classType.ts";

export function Twoheadedwolf() {
    return Enemy({
        name: 'Two-Headed Wolf',
        hitpoints: 30,
        defence: 3,
        currency: 15,
        attacks: [
            {
                damage: '1d6',
                damageSpecial: fireDamage,
                speed: 5,
                attackPriority: [
                    [ClassType.Warrior, [1,2,3,4]],
                    [ClassType.Rogue, [5,6]]
                ]
            }, 
            {
                damage: '1d6+1',
                damageSpecial: fireDamage,
                speed: 6,
                attackPriority: [
                    [ClassType.Warrior, [1,2,3,4]],
                    [ClassType.Rogue, [5,6]]
                ]
            }],
        onAttack: (game: IGame) => {
            if (game.worldProperties.freedFaeries) {
                game.logToLocationLog(game.currentLocation.descriptions['freedfaeries']);
                game.currentLocation.enemies.clear();
            }
        }
    });
}

function fireDamage(game: IGame, character: Character) {
    const fireDamage = 1 - (character.spellDefence ?? 0);
    
    if (fireDamage > 0) {
        character.currentHitpoints -= fireDamage;
        game.logToCombatLog(`${character.name} takes 1 fire damage!`);
    }
}