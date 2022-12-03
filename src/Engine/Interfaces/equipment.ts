import { IItem } from "./item";

export interface IEquipment {
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