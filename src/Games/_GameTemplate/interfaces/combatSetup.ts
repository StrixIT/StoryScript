import { ICombatSetup as StoryScriptCombatSetup } from 'storyScript/Interfaces/storyScript';
import { ICombatTurn } from './combatTurn';
import {Character} from "../character.ts";
import {IEnemy} from "./enemy.ts";

export interface ICombatSetup extends StoryScriptCombatSetup<ICombatTurn> {
    characters: Character[],
    enemies: IEnemy[],
}