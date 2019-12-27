/**
 * An answer to a character creation question.
 */
export interface ICreateCharacterQuestionEntry {
    /**
     * The answer text as displayed to the player.
     */
    text: string;

    /**
     * The value of the entry, which should be a character attribute that the bonus will be applied to.
     */
    value: string;

    /**
     * The bonus to apply to the character attribute when this answer is chosen.
     */
    bonus?: number;

    /**
     * Set this flag to true to make this choice finish character creation. 
     * This allows building a branched character creation process.
     */
    finish?: boolean;
}