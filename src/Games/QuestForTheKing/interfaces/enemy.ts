﻿import { IEnemy as StoryScriptIEnemy, Enemy as StoryScriptEnemy, ICollection } from 'storyScript/Interfaces/storyScript';
import { IFeature, IItem } from '../types';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    items?: ICollection<IItem>;
    attack?: string;
    reward?: number;
    activeNight?: boolean;
    activeDay?: boolean;
}