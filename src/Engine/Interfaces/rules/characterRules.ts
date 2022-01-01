import { ICharacter } from '../character';
import { IItem } from '../item';
import { IGame } from '../game';
import { ICreateCharacter } from '../createCharacter/createCharacter';

export interface ICharacterRules {
    /**
     * Use this function to determine what character attributes should be shown on the character sheet. Return the names
     * of the attributes (e.g. 'strength').
     */
    getSheetAttributes?(): string[];

    /**
     * Use this function to specify the steps in your character creation process. Return the character creation sheet.
     */
    getCreateCharacterSheet?(): ICreateCharacter;

    /**
     * This function is called when moving from one step in the character creation process to the next.
     * @param characterData The character sheet filled in
     */
    onNextCharacterCreationStep?(characterData: ICreateCharacter): void;

    /**
     * Use this function to specify the steps in your character level up process. Return the level-up sheet.
     */
    getLevelUpSheet?(): ICreateCharacter;

    /**
     * This function is called when the character sheet has been filled in and the game is about to start.
     * You can add custom logic here to prepare your character before game start. Return the player character.
     * @param game The game about to start
     * @param characterData The character sheet filled in
     */
    createCharacter?(game: IGame, characterData: ICreateCharacter): ICharacter;

    /**
     * This function is called when the level-up sheet has been filled in and the game is about to continue.
     * You can add custom logic here to process the level-up sheet before the game continues. Return true if
     * you also want the default level-up sheet processing to run.
     * @param game The game about to continue
     * @param characterData The level-up sheet filled in
     */
    levelUp?(character: ICharacter, characterData: ICreateCharacter): boolean;

    /**
     * Specify this function if you want to apply custom rules before allowing a player to equip an item. If the player
     * is not allowed to equip the item, return false.
     * @param game The active game
     * @param character The player character
     * @param item The item about to be equipped
     */
    beforeEquip?(game: IGame, character: ICharacter, item: IItem): boolean;

    /**
     * Specify this function if you want to apply custom rules before allowing a player to unequip an item. If the player
     * is not allowed to unequip the item, return false.
     * @param game The active game
     * @param character The player character
     * @param item The item about to be unequipped
     */
    beforeUnequip?(game: IGame, character: ICharacter, item: IItem): boolean;

    /**
     * Specify this function if you want to apply custom rules before a player picks up an item. Return false if the player
     * should not pick up the item.
     * @param game The active game
     * @param character The player character
     * @param item The item about to be picked up
     */
     beforePickup?(game: IGame, character: ICharacter, item: IItem): boolean;

    /**
     * Specify this function if you want to apply custom rules before a player drops an item. Return false if the player
     * should not drop the item.
     * @param game The active game
     * @param character The player character
     * @param item The item about to be dropped
     */
    beforeDrop?(game: IGame, character: ICharacter, item: IItem): boolean;

    /**
     * Specify this function if you want to do something special when the player's health changes.
     * @param game The active game
     * @param change The change in health points. If the player is wounded, the number will be negative.
     */
    hitpointsChange?(game: IGame, change: number): void;
}