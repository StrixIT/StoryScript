import { IEnemy as StoryScriptIEnemy, Enemy as StoryScriptEnemy } from 'storyScript/Interfaces/storyScript';
import { IFeature } from '../types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    attack?: string;
    reward?: number;
}