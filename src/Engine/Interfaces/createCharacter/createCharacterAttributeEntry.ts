export interface ICreateCharacterAttributeEntry {
    /**
     * The attribute text as displayed to the player.
     */
    attribute: string;

    /**
     * The value of the attribute.
     */
    value?: number | string;

    /**
     * The minimum number the attribute should have.
     */
    min?: number;

    /**
     * The maximum number the attribute is allowed to have.
     */
    max?: number;
}