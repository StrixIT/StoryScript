import { IEnemy as StoryScriptIEnemy, Enemy as StoryScriptEnemy } from 'storyScript/Interfaces/storyScript';
import { IFeature, IItem } from '../types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    items?: IItem[];
    // Add game-specific enemy properties here
    attack?: string;
}