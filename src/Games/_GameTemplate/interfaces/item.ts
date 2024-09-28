import {
    IGroupableItem as StoryScriptIGroupableItem,
    IItem as StoryScriptIItem,
    Item as StoryScriptItem
} from 'storyScript/Interfaces/storyScript';
import {IFeature} from '../types';

export function Item<T extends IItem>(entity: T): T {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    // Add game-specific item properties here
}

export interface IGroupableItem extends StoryScriptIGroupableItem<IItem> {
    // Add game-specific item properties here
}