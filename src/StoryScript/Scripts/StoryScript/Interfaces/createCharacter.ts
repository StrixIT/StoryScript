module StoryScript {
    export interface ICreateCharacter {
        name?: string;
        steps: ICreateCharacterStep[];
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
        min: number;
        max: number;
    }
}