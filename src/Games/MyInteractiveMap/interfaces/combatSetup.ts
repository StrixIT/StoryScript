import { ICombatSetup as StoryScriptCombatSetup } from 'storyScript';
import { ICombatTurn } from './combatTurn';
import {Character} from "../character";
import {IEnemy} from "./enemy";

export interface ICombatSetup extends StoryScriptCombatSetup<ICombatTurn> {
    characters: Character[],
    enemies: IEnemy[],
}