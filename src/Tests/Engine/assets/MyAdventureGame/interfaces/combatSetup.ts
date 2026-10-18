import { ICombatSetup as StoryScriptCombatSetup } from 'storyScript';
import { ICombatTurn } from './combatTurn';

export interface ICombatSetup extends StoryScriptCombatSetup<ICombatTurn> {
}