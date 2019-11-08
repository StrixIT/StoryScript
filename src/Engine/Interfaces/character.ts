import { IItem } from './item';
import { ICollection } from './collection';
import { IQuest } from './quest';

/**
 * The player character in the StoryScript game.
 */
export interface ICharacter {
    /**
     * The name of the player character.
     */
    name: string;

    /**
     * The file name of the image to display for the character. The file name should be relative to the index.html file.
     */
    portraitFileName?: string;

    /**
     * The number of points scored by the player so far. This property should be managed in your game rules. The score will
     * be used to determine the player's ranking in the high-score list on game end.
     */
    score: number;

    /**
     * The total health of the player when in top condition.
     */
    hitpoints: number;

    /**
     * The current health of the player.
     */
    currentHitpoints: number;

    /**
     * The amount of credits the player has, in whatever form.
     */
    currency: number;

    /**
     * All items the player is carrying in his backpack. Note that equipped items are not in this list.
     */
    items: ICollection<IItem>;

    /**
     * All items the character has that can be used during combat.
     */
    combatItems?: ICollection<IItem>;

    /**
     * All the quests the player has accepted, both active and complete.
     */
    quests?: ICollection<IQuest>;

    /**
     * The items the character has equipped.
     */
    equipment: {
        /**
         * Items worn on the head, ranging from diadem to helmets covering the entire head.
         */
        head?: IItem,
        /**
         * Items worn around the neck, like amulets.
         */
        amulet?: IItem,
        /**
         * Items worn on the torso and upper arms.
         */
        body?: IItem,
        /**
         * Items worn on the hands, like gloves.
         */
        hands?: IItem,
        /**
         * Items that can be used in the non-dominant hand.
         */
        leftHand?: IItem,
        /**
         * Small items worn around the finger on the non-dominant hand.
         */
        leftRing?: IItem,
        /**
         * Items that can be used in the dominant hand.
         */
        rightHand?: IItem,
        /**
         * Small items worn around the finger on the dominant hand.
         */
        rightRing?: IItem,
        /**
         * Items worn on the legs.
         */
        legs?: IItem,
        /**
         * Items like boots that are used for walking but may also offer additional protection.
         */
        feet?: IItem
    }

    /**
     * The player character level. This is an optional element, you should track level and take care of level
     * up in your game rules.
     */
    level?: number;
}