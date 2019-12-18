import { ICreateCharacterAttributeEntry } from './createCharacterAttributeEntry';

/**
 * An attribute entry for a create character question. 
 */
export interface ICreateCharacterAttribute {
    /**
     * The text for the attribute selection as displayed to the player.
     */
    question: string;

    /**
     * The total number to be distributed among the entries.
     */
    numberOfPointsToDistribute?: number;

    /**
     * The attributes to distribute the points for.
     */
    entries: ICreateCharacterAttributeEntry[];
}