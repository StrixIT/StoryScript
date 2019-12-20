import { IItem as StoryScriptIItem } from 'storyScript/Interfaces/item';
import { Item as StoryScriptItem } from 'storyScript/ObjectConstructors';
import { IFeature } from '../types';

export function Item(entity: IItem): IItem {
    return StoryScriptItem(entity);
}

export interface IItem extends IFeature, StoryScriptIItem {
    // Add game-specific item properties here
}