import {IEnemy, IItem} from "storyScript";

export interface ICombatWinnings {
    currency: number;
    itemsWon: IItem[];
    enemiesDefeated: IEnemy[];
}