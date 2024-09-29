import {
    IGroupableItem as StoryScriptIGroupableItem,
    IItem as StoryScriptIItem,
    Item as StoryScriptItem
} from 'storyScript/Interfaces/storyScript';
import { IFeature, IGame } from '../types';
import { ClassType } from '../classType';
import { IEnemy } from 'src/Games/MyAdventureGame/types';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    damage?: string;
    damageBonus?: (game: IGame, enemy: IEnemy) => number;
    defense?: number;
    speed?: number;
    arcane?: boolean;
    ranged?: boolean;
    recharge?: number;
    itemClass?: ClassType | ClassType[];
    attackText?: string;
    activeNight?: boolean;
    activeDay?: boolean;
    power?: string;
}

export interface IGroupableItem extends IItem, StoryScriptIGroupableItem<IItem> {
    // Add game-specific item properties here
}