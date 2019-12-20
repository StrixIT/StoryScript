import { IEnemy as StoryScriptIEnemy } from 'storyScript/Interfaces/enemy';
import { Enemy as StoryScriptEnemy } from 'storyScript/ObjectConstructors';
import { IFeature } from '../types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    attack?: string;
}