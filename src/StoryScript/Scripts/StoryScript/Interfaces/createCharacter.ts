﻿module StoryScript {
    export interface ICreateCharacter {
        name?: string;
        steps: ICreateCharacterStep[];
        currentStep?: number;
        nextStep?(data: ICreateCharacter): void;
    }

    export interface ICreateCharacterStep {
        questions?: ICreateCharacterQuestion[];
        attributes?: ICreateCharacterAttribute[];
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
        attribute: string;
        value: number;
        min: number;
        max: number;
    }
}