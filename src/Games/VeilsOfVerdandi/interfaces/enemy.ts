import {Enemy as StoryScriptEnemy, ICharacter, IEnemy as StoryScriptIEnemy} from 'storyScript/Interfaces/storyScript';
import {IFeature, IGame, IItem} from '../types';
import { ClassType } from '../classType';

export function Enemy(entity: IEnemy): IEnemy {
    return StoryScriptEnemy(entity);
}

export interface IEnemy extends IFeature, StoryScriptIEnemy {
    items?: IItem[];
    attacks?: EnemyAttack[];
    defence?: number;
    activeNight?: boolean;
    activeDay?: boolean;
    frozen?: boolean;
    frightened?: boolean;
    confused?: boolean;

    effects?: string[];
}

export interface EnemyAttack {
    isMagic?: boolean;
    damage: string;
    damageSpecial?: (game: IGame, character: ICharacter) => void;
    speed: number;
    attackPriority: [ClassType, number[]][]
}