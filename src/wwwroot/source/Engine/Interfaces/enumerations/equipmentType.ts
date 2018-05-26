namespace StoryScript {
    /**
     * Used to specify what part of the player body the item is meant for, if any.
     */
    export enum EquipmentType {
        Head,
        Amulet,
        Hands,
        LeftHand,
        LeftRing,
        RightHand,
        RightRing,
        Body,
        Legs,
        Feet,

        /**
         * All other type of items. Miscellaneous items cannot be equipped.
         */
        Miscellaneous
    }
}