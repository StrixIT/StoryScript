import {ICombatSetup as StoryScriptCombatSetup} from 'storyScript';
import {Character, ICombatTurn, IEnemy} from '../types';

export interface ICombatSetup extends StoryScriptCombatSetup<ICombatTurn> {
    characters: Character[],
    enemies: IEnemy[],
}