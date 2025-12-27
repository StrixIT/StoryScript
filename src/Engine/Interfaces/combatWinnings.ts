import {IItem} from "storyScript/Interfaces/item.ts";
import {IEnemy} from "storyScript/Interfaces/enemy.ts";

export interface ICombatWinnings {
    currency: number;
    itemsWon: IItem[];
    enemiesDefeated: IEnemy[];
}