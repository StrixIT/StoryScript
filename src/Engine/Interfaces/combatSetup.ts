import { ICombatTurn } from "./combatTurn";
import {IEnemy} from "./enemy.ts";
import {ICharacter} from "./character.ts";
import {ICombatWinnings} from "storyScript/Interfaces/combatWinnings.ts";

export interface ICombatSetup<T extends ICombatTurn> extends Array<T> {
    roundHeader: string;
    noActionText: string;
    round: number;
    characters: ICharacter[];
    enemies: IEnemy[];
    winnings: ICombatWinnings
}