import { ICombatRound as StoryScriptCombatRound } from 'storyScript/Interfaces/storyScript';
import { ICombatSetup } from './combatSetup';

export interface ICombatRound extends StoryScriptCombatRound<ICombatSetup> {
}