﻿import {IFeature} from './feature';
import {IEnemy} from './enemy';
import {IGame} from './game';
import {EquipmentType} from './enumerations/equipmentType';
import {IEquipment} from './equipment';
import {ICharacter} from './character';
import {TargetType} from './enumerations/targetType';

/**
 * An item that can be found in the game and used by the character.
 */
export interface IItem extends IFeature {
    /**
     * One or more parts of the character body this item is for (or no part, in case of a miscellaneous item).
     * Use string values only for custom equipment types.
     */
    equipmentType: EquipmentType | EquipmentType[] | string | string[];

    /**
     * True if the item uses all the slots specified by the equipment type array, false if it occupies only one.
     */
    usesMultipleSlots?: boolean;

    /**
     * Set the target type for the item if the item needs to be used on a target. For example, a weapon targets
     * an enemy, while a healing spell will target an ally. If the target type is not specified, the item cannot
     * be used on enemies or allies.
     */
    targetType?: TargetType;

    /**
     * The details about this item as displayed to the player. If you use an HTML-page to describe the item, the contents of that HTM-page
     * will be used to set this property at run-time.
     */
    description?: string;

    /**
     * The number of times the item can be used before disappearing. If not specified, the item can be used indefinitely.
     */
    charges?: number;

    /**
     * When this flag is set to true or the function returns true and the item has a use function specified, the use action will also be
     * available during combat.
     */
    useInCombat?: boolean | ((item: IItem, equipment: IEquipment) => boolean);

    /**
     * When this flag is set to false, the item is not selectable. This is used to allow items to be unselectable during combat,
     * for example when you want items to be available only during certain rounds.
     */
    selectable?: boolean;

    /**
     * The value of the item in whatever credits are used in the game.
     */
    value?: number;

    /**
     * When this flag is set to true, the item is not shown to the player. Useful to only conditionally make items available on a location.
     */
    inactive?: boolean;

    /**
     * When this is a flag set to true or has a function that returns true, the item cannot be dropped by the player. This is useful to
     * have items that should not be dropped, such as an adventure map.
     */
    canDrop?: boolean | ((game: IGame, item: IItem) => boolean);

    /**
     * When specified, this function will be executed when the item is equipped by the player.
     * @param character The character equipping the item
     * @param item The item to be equipped
     * @param game The game object
     */
    equip?(character: ICharacter, item: IItem, game: IGame): boolean;

    /**
     * When specified, this function will be executed when the item is unequipped by the player.
     * @param character The character unequipping the item
     * @param item The item to be unequipped
     * @param game The game object
     */
    unequip?(character: ICharacter, item: IItem, game: IGame): boolean;

    /**
     * When specified, this item can be used and a use action becomes available on the item. The function will be executed when the player
     * executes this action. Return a promise if the result should be awaited.
     * @param game The game object
     * @param character The character that uses the item
     * @param item The item to use
     * @param target The target to use the item on, if any
     */
    use?(game: IGame, character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void;

    /**
     * When specified, this action determines whether the use action for an item will be shown.
     * @param game The game object
     * @param character The character that wants to use the item
     * @param item The item to show the use action for
     */
    canUse?(game: IGame, character: ICharacter, item: IItem): boolean;

    /**
     * When specified, this action determines whether the item can be used on the requested target.
     * @param game The game object
     * @param item The item to check the target for
     * @param target The target on which the item would be used
     */
    canTarget?(game: IGame, item: IItem, target: IEnemy | ICharacter): boolean;
}