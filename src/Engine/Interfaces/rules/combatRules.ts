import { ICharacter } from '../character';
import { ICompiledLocation } from '../compiledLocation';
import { IEnemy } from '../enemy';
import { IGame } from '../game';
import { IItem } from '../item';

export interface ICombatRules {
    /**
     * This function allows you to add custom logic to execute before combat starts.
     * @param game The active game
     * @param location The current location
     */
    initCombat?(game: IGame, location: ICompiledLocation): void;

    /**
     * This function determines the combat rules for your game. Return a promise
     * when you want the engine to wait for your function to complete asynchronously.
     * @param game The active game
     * @param character The character fighting
     * @param enemy The enemy being attacked
     * @param retaliate True if the enemies present can fight back, false or undefined otherwise
     */
    fight?(game: IGame, character: ICharacter, enemy: IEnemy, retaliate?: boolean): Promise<void>| void;

    /**
     * This function will be called when an enemy is defeated.
     * @param game The active game
     * @param character The character defeating the enemy
     * @param enemy The enemy just defeated
     */
    enemyDefeated?(game: IGame, character: ICharacter, enemy: IEnemy): void;

    /**
     * Specify this function if you want to apply custom rules before an enemy drops an item when defeated.
     * Return false if the enemy should not drop the item.
     * @param game The active game
     * @param item The item about to be unequipped
     */
    beforeDrop?(game: IGame, enemy: IEnemy, item: IItem): boolean;
}