import { IItem as StoryScriptIItem, Item as StoryScriptItem } from 'storyScript/Interfaces/storyScript';
import { IFeature } from '../types';
import { ClassType } from '../classType';
import { IEnemy } from 'src/Games/MyAdventureGame/types';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    damage?: string;
    damageBonus?: (enemy: IEnemy) => number;
    defense?: number;
    speed?: number;
    recharge?: number;
    itemClass?: ClassType | ClassType[];
    attackText?: string;
    activeNight?: boolean;
    activeDay?: boolean;
}