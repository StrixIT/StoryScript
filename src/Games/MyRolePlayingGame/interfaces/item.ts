import {
    IGroupableItem as StoryScriptIGroupableItem,
    IItem as StoryScriptIItem,
    Item as StoryScriptItem
} from 'storyScript/Interfaces/storyScript';
import { IFeature } from '../types';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    damage?: number;
    defense?: number;
}

export interface IGroupableItem extends IItem, StoryScriptIGroupableItem<IItem> {
    // Add game-specific item properties here
}