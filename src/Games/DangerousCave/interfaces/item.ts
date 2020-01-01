import { IItem as StoryScriptIItem, Item as StoryScriptItem } from 'storyScript/Interfaces/storyScript';
import { IFeature } from '../types';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    schade?: number;
    verdediging?: number;
    oplettendheid?: number;
}