import {IEnemy, IEnemyAttack} from "./enemy.ts";
import {Character} from "../character.ts";

export interface CombatParticipant {
    participant: IEnemy | Character;
    attack?: IEnemyAttack;
    attackIndex?: number;
    combatSpeed?: number;
}