import { ICreateCharacterStep } from './createCharacterStep';

/**
 * The definition of the sheet to create a character for the game.
 */
export interface ICreateCharacter {
    /**
     * The steps in the character creation process.
     */
    steps: ICreateCharacterStep[];

    /**
     * The currently active step.
     */
    currentStep?: number;

    /**
     * The function that will select the next step in the character creation process. This function is added by the engine at run-time.
     * @param character The character sheet filled in so far
     * @param next True if the next step is to be triggered, false otherwise. Defaults to true.
     */
    nextStep?(character: ICreateCharacter, next?: boolean): void;
}