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
    pickupItem(character: ICharacter, item: IItem): boolean;
    isEquippable(item: IItem): boolean;
    equipItem(character: ICharacter, item: IItem): boolean;
    unequipItem(character: ICharacter, item: IItem): boolean;
    isSlotUsed(character: ICharacter, slot: string): boolean;
    dropItem(character: ICharacter, item: IItem): void;
    useItem(character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void;
    questStatus(quest: IQuest): string;
}