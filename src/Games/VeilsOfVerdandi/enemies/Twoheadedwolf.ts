import {Character, Enemy, IEnemy, IGame} from '../types';
import {ClassType} from "../classType.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";

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
                game.currentLocation.descriptionSelector = 'freedfaeries';
                game.currentLocation.enemies.clear();
                game.playState = null;
            }
        }
    });
}

function fireDamage(game: IGame, enemy: IEnemy, character: Character) {
    const fireDamage = 1 - (character.spellDefence ?? 0);
    
    if (fireDamage > 0) {
        character.currentHitpoints -= fireDamage;
        game.logToCombatLog(`${character.name} takes 1 fire damage!`);
    }
}