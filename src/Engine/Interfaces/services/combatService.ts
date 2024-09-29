import {ICombatSetup} from "storyScript/Interfaces/combatSetup.ts";
import {ICombatTurn} from "storyScript/Interfaces/combatTurn.ts";
import {IItem} from "storyScript/Interfaces/item.ts";

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
}