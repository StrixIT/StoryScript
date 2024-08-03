import {ICombatTurn as StoryScriptCombatTurn} from 'storyScript/Interfaces/storyScript';
import {Character, IEnemy, IItem} from '../types';

export interface ICombatTurn extends StoryScriptCombatTurn {
    character: Character;
    target: IEnemy;
    item?: IItem;
}