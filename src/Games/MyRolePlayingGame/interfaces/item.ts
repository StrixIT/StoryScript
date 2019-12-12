import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IFeature } from '../types';

export function Item(entity: IItem): IItem {
    return StoryScript.Item(entity);
}

export interface IItem extends IFeature, StoryScript.IItem {
    damage?: string;
    defense?: number;
}