import {
    ICharacter,
    ICreateCharacter,
    ICreateCharacterAttribute,
    ICreateCharacterAttributeEntry,
    ICreateCharacterStep,
    IGame,
    IQuest
} from 'storyScript';

export interface ICharacterService {
    getSheetAttributes(): string[];

    setupCharacter(): ICreateCharacter;

    setupLevelUp(): ICreateCharacter;

    createCharacter(game: IGame, characterData: any): ICharacter;

    levelUp(character: ICharacter): ICharacter;

    limitSheetInput(value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void;

    distributionDone(sheet: ICreateCharacter, step: ICreateCharacterStep): boolean;

    isSlotUsed(character: ICharacter, slot: string): boolean;

    questStatus(quest: IQuest): string;

    /**
     * Check whether all the equipment on the characters is in valid equipment slots. The equipment type may change
     * during editing, leaving items previously equipped in invalid slots.
     */
    checkEquipment(): void;
}