import { ICharacter } from '../character';
import { IItem } from '../item';
import { IQuest } from '../quest';
import { IGame } from '../game';
import { ICreateCharacter } from '../createCharacter/createCharacter';
import { ICreateCharacterAttribute } from '../createCharacter/createCharacterAttribute';
import { ICreateCharacterAttributeEntry } from '../createCharacter/createCharacterAttributeEntry';
import { ICreateCharacterStep } from '../createCharacter/createCharacterStep';
import {IEnemy} from "storyScript/Interfaces/enemy.ts";

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