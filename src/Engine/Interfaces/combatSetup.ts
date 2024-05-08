import { ICombatTurn } from "./combatTurn";

export interface ICombatSetup<T extends ICombatTurn> extends Array<T> {
    round: number;
}