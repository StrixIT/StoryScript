import {ICharacter, ICombatSetup, ICombatTurn, IEnemy, IItem} from 'storyScript';

export interface ICombatService {
    /**
     * The function executed when combat is started.
     */
    initCombat(): void;

    /**
     * The function executed when the player attacks an enemy.
     * @param combatRound The setup for this combat round
     */
    fight(combatRound: ICombatSetup<ICombatTurn>): Promise<void> | void;

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