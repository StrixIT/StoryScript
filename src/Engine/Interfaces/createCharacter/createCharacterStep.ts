import { ICreateCharacter } from './createCharacter';
import { ICreateCharacterQuestion } from './createCharacterQuestion';
import { ICreateCharacterAttribute } from './createCharacterAttribute';
import { IParty } from '../party';

/**
 * The definition of a step in the character creation process.
 */
export interface ICreateCharacterStep {
    /**
     * The text describing this step in the creation process to the player.
     */
    description?: string;

    /**
     * The questions to show as part of this step.
     */
    questions?: ICreateCharacterQuestion[];

    /**
     * The attributes to show as part of this step.
     */
    attributes?: ICreateCharacterAttribute[];

    /**
     * The total numner of points to distribute over multiple attributes.
     */
    numberOfAttributePoints?: number;

    /**
     * The selector that determines what step will be activated after the current one.
     * Either pass the number of the step or a function returning that number.
     */
    nextStepSelector?: number | ((party: IParty, character: ICreateCharacter, currentStep: ICreateCharacterStep) => number);

    /**
     * Set this flag to true to mark this step as one of the final steps in character creation. 
     * This allows building a branched character creation process.
     */
    finish?: boolean;

        /**
     * A function that executes when the step is to be displayed to the player.
     * @param party The party created so far
     * @param character The character sheet filled in so far
     * @param previousStep The step just completed by the player
     * @param currentStep The step about to be shown to the player
     */
    initStep?(party: IParty, character: ICreateCharacter, previousStep: number, currentStep: ICreateCharacterStep): void;
}