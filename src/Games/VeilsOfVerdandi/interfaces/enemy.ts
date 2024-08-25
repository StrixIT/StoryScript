import {Enemy as StoryScriptEnemy, IEnemy as StoryScriptIEnemy} from 'storyScript/Interfaces/storyScript';
import {IFeature, IItem} from '../types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    items?: IItem[];
    damage?: string;
    defence?: number;
    speed?: number;
    reward?: number;
    attackPriority?: Record<string, number[]>[];
    activeNight?: boolean;
    activeDay?: boolean;
    frozen?: boolean;
    frightened?: boolean;
    confused?: boolean;
}