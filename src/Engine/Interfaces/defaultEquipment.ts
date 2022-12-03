import { IEquipment } from './equipment';
import { IItem } from './item';

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

    // Remove the slots you don't want to use
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