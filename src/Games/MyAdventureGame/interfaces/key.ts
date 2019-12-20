import { IKey as StoryScriptIKey } from 'storyScript/Interfaces/key';
import { Key as StoryScriptKey } from 'storyScript/ObjectConstructors';
import { IItem } from '../types';

export function Key(entity: IKey): IKey {
    return StoryScriptKey(entity);
}

export interface IKey extends IItem, StoryScriptIKey {
    // Add game-specific key properties here
}