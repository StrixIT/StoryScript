import { ICombatTurn } from "./combatTurn";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";

export interface ICombatSetup<T extends ICombatTurn> extends Array<T> {
    roundHeader: string;
    noActionText: string;
    round: number;
    characters: ICharacter[];
    enemies: IEnemy[];
}