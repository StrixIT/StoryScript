import { ICreateCharacter, ICreateCharacterAttribute, ICreateCharacterAttributeEntry, ICreateCharacterStep } from '../../Interfaces/createCharacter/createCharacters';
import { ICharacter } from '../../Interfaces/character';
import { IItem } from '../../Interfaces/item';
import { IQuest } from '../../Interfaces/quest';
import { IGame } from '../../Interfaces/game';

export interface ICharacterService {
    getSheetAttributes(): string[];
    setupCharacter(): ICreateCharacter;
    setupLevelUp(): ICreateCharacter;
    createCharacter(game: IGame, characterData: any): ICharacter;
    levelUp(): ICharacter;
    limitSheetInput(value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void;
    distributionDone(sheet: ICreateCharacter, step: ICreateCharacterStep): boolean;
    pickupItem(item: IItem): boolean;
    canEquip(item: IItem): boolean;
    equipItem(item: IItem): boolean;
    unequipItem(item: IItem): boolean;
    isSlotUsed(slot: string): boolean;
    dropItem(item: IItem): void;
    questStatus(quest: IQuest): string;
}