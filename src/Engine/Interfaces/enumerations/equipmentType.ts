/**
 * Used to specify what part of the player body the item is meant for, if any. You can specify the equipment slots used in your game as an object
 * on the character class of your game. Note that items may belong to more than one type, e.g. two-handed weapons that require both the left and 
 * right hand to use.
 */
export enum EquipmentType {
    /**
     * Items worn on the head, ranging from diadem to helmets covering the entire head.
     */
    Head,

    /**
     * Items worn around the neck, like amulets.
     */
    Amulet,

    /**
     * Items worn on the torso and upper arms.
     */
    Body,

    /**
     * Items worn on the hands, like gloves.
     */
    Hands,

    /**
     * Items that can be used in the non-dominant hand.
     */
    LeftHand,

    /**
     * Small items worn around the finger on the non-dominant hand.
     */
    LeftRing,

    /**
     * Items that can be used in the dominant hand.
     */
    RightHand,

    /**
     * Small items worn around the finger on the dominant hand.
     */
    RightRing,

    /**
     * Items worn on the legs.
     */
    Legs,

    /**
     * Items like boots that are used for walking but may also offer additional protection.
     */
    Feet,

    /**
     * All other type of items. Miscellaneous items cannot be equipped.
     */
    Miscellaneous
}