import {IItem} from "storyScript/Interfaces/item.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {IGroupableItem} from "storyScript/Interfaces/groupableItem.ts";

export interface IItemService {
    getItemName(item: IItem): string;
    pickupItem(character: ICharacter, item: IItem): boolean;
    canGroupItem(character: ICharacter, group: IGroupableItem<IItem>, item: IGroupableItem<IItem>): boolean;
    groupItem (character: ICharacter, group: IGroupableItem<IItem>, item: IGroupableItem<IItem>): boolean;
    splitItemGroup(character: ICharacter, item: IGroupableItem<IItem>): void;
    useItem(character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void;
    isEquippable(item: IItem, character?: ICharacter): boolean;
    equipItem(character: ICharacter, item: IItem): boolean;
    unequipItem(character: ICharacter, item: IItem): boolean;
    canDrop(item: IItem): boolean
    dropItem(character: ICharacter, item: IItem): void;
}