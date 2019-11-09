import * as StoryScript from '../../../Engine/Interfaces/storyScript';
import { IFeature } from './types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScript.Enemy(entity);
}

export interface IEnemy extends IFeature, StoryScript.IEnemy {
    attack: string;
}