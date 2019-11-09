import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IItem } from './types';

export function Key(entity: IKey): IKey {
    return StoryScript.Key(entity);
}

export interface IKey extends IItem, StoryScript.IKey {
    // Add game-specific key properties here
}