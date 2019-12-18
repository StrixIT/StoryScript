import { ICreateCharacterQuestionEntry } from './createCharacterQuestionEntry';

/**
 * A question for the player to answer when creating a character.
 */
export interface ICreateCharacterQuestion {
    /**
     * The question text as displayed to the player.
     */
    question: string;

    /**
     * The available replies to the question.
     */
    entries: ICreateCharacterQuestionEntry[];

    /**
     * The currently selected entry. Used during run-time.
     */
    selectedEntry?: ICreateCharacterQuestionEntry;
}