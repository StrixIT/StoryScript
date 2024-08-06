import { IKey as StoryScriptIKey, Key as StoryScriptKey } from 'storyScript/Interfaces/storyScript';
import { IItem } from '../types';

export function Key(entity: IKey): IKey {
    return StoryScriptKey(entity);
}

export interface IKey extends IItem, StoryScriptIKey {
    // Add game-specific key properties here
}