import { IPerson as StoryScriptIPerson, Person as StoryScriptPerson } from 'storyScript/Interfaces/storyScript';
import { IEnemy } from '../types';

export function Person(entity: IPerson): IPerson {
    return StoryScriptPerson(entity);
}

export interface IPerson extends IEnemy, StoryScriptIPerson {
    // Add game-specific person properties here
}