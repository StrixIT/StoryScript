import { IPerson as StoryScriptIPerson } from 'storyScript/Interfaces/person';
import { Person as StoryScriptPerson } from 'storyScript/ObjectConstructors';
import { IEnemy } from '../types';

export function Person(entity: IPerson): IPerson {
    return StoryScriptPerson(entity);
}

export interface IPerson extends IEnemy, StoryScriptIPerson {
    // Add game-specific person properties here
}