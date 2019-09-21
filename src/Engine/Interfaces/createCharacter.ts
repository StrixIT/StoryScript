namespace StoryScript {
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

    /**
     * The definition of a step in the character creation process.
     */
    export interface ICreateCharacterStep {
        /**
         * A function that executes when the step is to be displayed to the player.
         * @param character The character sheet filled in so far
         * @param previousStep The step just completed by the player
         * @param currentStep The step about to be shown to the player
         */
        initStep?(character: ICreateCharacter, previousStep: number, currentStep: ICreateCharacterStep): void;

        /**
         * The questions to show as part of this step.
         */
        questions?: ICreateCharacterQuestion[];

        /**
         * The attributes to show as part of this step.
         */
        attributes?: ICreateCharacterAttribute[];

        /**
         * The validation to perform before continuing to the next step.
         * @param character The character sheet filled in so far
         */
        validation?(character: ICreateCharacter): string;

        /**
         * The selector that determines what step will be activated after the current one.
         * Either pass the number of the step or a function returning that number.
         */
        nextStepSelector?: number | ((character: ICreateCharacter, currentStep: ICreateCharacterStep) => number);

        /**
         * Set this flag to true to mark this step as one of the final steps in character creation. 
         * This allows building a branched character creation process.
         */
        finish?: boolean;
    }

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
}