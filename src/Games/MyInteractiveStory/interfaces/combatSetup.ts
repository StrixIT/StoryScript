import { ICombatSetup as StoryScriptCombatSetup } from 'storyScript/Interfaces/storyScript';
import { IEnemy, IItem } from '../types';

export interface ICombatSetup extends StoryScriptCombatSetup {
    target: IEnemy;

    weapon?: IItem;

    item?: IItem;
}