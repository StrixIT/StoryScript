import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IEnemy } from '../types';

export function Person(entity: IPerson): IPerson {
    return StoryScript.Person(entity);
}

export interface IPerson extends IEnemy, StoryScript.IPerson {
    // Add game-specific person properties here
}