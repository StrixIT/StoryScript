module StoryScript {
    export interface ICreateCharacter {
        steps: ICreateCharacterStep[];
        currentStep?: number;
        nextStep?(data: ICreateCharacter): void;
    }

    export interface ICreateCharacterStep {
        initStep?: (character: ICreateCharacter, previousStep: number, currentStep: ICreateCharacterStep) => void;
        questions?: ICreateCharacterQuestion[];
        attributes?: ICreateCharacterAttribute[];
        validation?: (character: ICreateCharacter) => string;
        nextStepSelector?: number | ((character: ICreateCharacter, currentStep: ICreateCharacterStep) => number);
    }

    export interface ICreateCharacterQuestion {
        question: string;
        entries: ICreateCharacterQuestionEntry[];
        selectedEntry?: ICreateCharacterQuestionEntry;
    }

    export interface ICreateCharacterQuestionEntry {
        text: string;
        value: string;
        bonus?: number;
    }

    export interface ICreateCharacterAttribute {
        question: string;
        entries: ICreateCharacterAttributeEntry[];
    }

    export interface ICreateCharacterAttributeEntry {
        attribute: string;
        value?: number | string;
        min?: number;
        max?: number;
    }
}