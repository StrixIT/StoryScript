import {IItem} from './item';
import {IEquipment} from './equipment';
import {IActor} from "./actor";

/**
 * The player character in the StoryScript game.
 */
export interface ICharacter extends IActor {
    /**
     * The name of the player character.
     */
    name: string;

    /**
     * The file name of the image to display for the character. The file name should be relative to the index.html file.
     */
    portraitFileName?: string;

    /**
     * All items the player is carrying in his backpack. Note that equipped items are not in this list.
     */
    items: IItem[];

    /**
     * All items the character has that can be used during combat.
     */
    combatItems?: IItem[];

    /**
     * The items the character has equipped.
     */
    equipment: IEquipment

    /**
     * The player's experience. This is an optional element, you should track experience in your game rules.
     */
    experience?: number;

    /**
     * The player character level. This is an optional element, you should track level and take care of level
     * up in your game rules.
     */
    level?: number;

    /**
     * True when this is the active party character, false otherwise. This is a runtime property managed by StoryScript.
     */
    isActiveCharacter?: boolean;
}