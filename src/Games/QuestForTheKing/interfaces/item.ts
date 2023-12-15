import { IItem as StoryScriptIItem, Item as StoryScriptItem } from 'storyScript/Interfaces/storyScript';
import { IFeature } from '../types';
import { ClassType } from '../classType';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    damage?: string;
    defense?: number;
    dayAvailable?: number;
    arcane?: boolean;
    itemClass?: ClassType | ClassType[];
    attackText?: string;
    activeNight?: boolean;
    activeDay?: boolean;
}