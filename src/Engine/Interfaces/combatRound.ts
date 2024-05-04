import { ICombatSetup } from "./combatSetup";

export interface ICombatRound<T extends ICombatSetup> extends Array<T> {
}