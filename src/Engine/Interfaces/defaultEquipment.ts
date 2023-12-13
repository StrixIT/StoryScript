import { IEquipment } from './equipment';
import { IItem } from './item';

/**
 * This class is for internal StoryScript use only, to determine which equipment slots belong
 * to the default ones and which are custom for a game.
 */
export class DefaultEquipment implements IEquipment {
    constructor() {
        this.head = null;
        this.amulet = null;
        this.body = null;
        this.hands = null;
        this.leftHand = null;
        this.leftRing = null;
        this.rightHand = null;
        this.rightRing = null;
        this.legs = null;
        this.feet = null;
    }

    head: IItem;
    amulet: IItem;
    body: IItem;
    hands: IItem;
    leftHand: IItem;
    leftRing: IItem;
    rightHand: IItem;
    rightRing: IItem;
    legs: IItem;
    feet: IItem;
}