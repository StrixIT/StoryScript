import {ICombatSetup} from "storyScript/Interfaces/combatSetup.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

export interface ICombatService {
    /**
     * The function executed when combat is started.
     */
    initCombat(): void;

    /**
     * The function executed when the player attacks an enemy.
     * @param combatRound The setup for this combat round
     * @param retaliate True if the enemy can retaliate (default), false otherwise
     */
    fight(combatRound: ICombatSetup<ICombatTurn>, retaliate?: boolean): Promise<void> | void;

    /**
     * Gets a value indicating whether the item is selectable. True when selectable, false otherwise.
     * @param item The item to check.
     */
    isSelectable(item: IItem): boolean;

    /**
     * Gets a value indicating whether an item can target the proposed target. True when so, false
     * otherwise.
     * @param item The item to check the target for.
     * @param target The proposed target.
     * @param character The character whom the item belongs to.
     */
    canTarget(item: IItem, target: IEnemy | ICharacter, character: ICharacter): boolean;
}