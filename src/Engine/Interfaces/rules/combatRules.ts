import {ICharacter, ICombatSetup, ICombatTurn, ICompiledLocation, IEnemy, IGame, IItem} from 'storyScript';

export interface ICombatRules {
    /**
     * This function allows you to add custom logic to execute before combat starts.
     * @param game The active game
     * @param location The current location
     */
    initCombat?(game: IGame, location: ICompiledLocation): void;

    /**
     * This function is called before each combat round starts, and allows you to override round settings.
     * @param game The active game
     * @param combat The setup for the next combat round
     */
    initCombatRound?(game: IGame, combat: ICombatSetup<ICombatTurn>): void;

    /**
     * This function determines the combat rules for your game. Return a promise
     * when you want the engine to wait for your function to complete asynchronously.
     * @param game The active game
     * @param combatRound The setup for this combat round
     * @param applyCombatEffects The function you can call to apply combat effects after you resolve a combat turn.
     */
    fight?(game: IGame, 
           combatRound: ICombatSetup<ICombatTurn>,
           applyCombatEffects: (game: IGame, combatDelay?: number, participant?: ICharacter | IEnemy, combatItem?: IItem, additionalEffects?: Promise<void>[]) => Promise<void[]>): Promise<void> | void;

    /**
     * Use this function to run custom code to determine whether an item should be selectable for combat
     * or not.
     * @param game The active game
     * @param item The item for which to determine whether it should be selectable
     */
    itemIsSelectable?(game: IGame, item: IItem): boolean;

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
     * @param character The character defeating the enemy
     * @param enemy The enemy defeated
     * @param item The item about to be dropped
     */
    beforeDrop?(game: IGame, character: ICharacter, enemy: IEnemy, item: IItem): boolean;
}