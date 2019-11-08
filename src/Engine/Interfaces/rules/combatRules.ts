import { ICompiledLocation } from '../compiledLocation';
import { IEnemy } from '../enemy';
import { IGame } from '../game';

export interface ICombatRules {
    /**
     * This function allows you to add custom logic to execute before combat starts.
     * @param game The active game
     * @param location The current location
     */
    initCombat?(game: IGame, location: ICompiledLocation): void;

    /**
     * This function determines the combat rules for your game.
     * @param game The active game
     * @param enemy The enemy being attacked
     * @param retaliate True if the enemies present can fight back, false or undefined otherwise
     */
    fight?(game: IGame, enemy: IEnemy, retaliate?: boolean): void;

    /**
     * This function will be called when an enemy is defeated.
     * @param game The active game
     * @param enemy The enemy just defeated
     */
    enemyDefeated?(game: IGame, enemy: IEnemy): void;
}