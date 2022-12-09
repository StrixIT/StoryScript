import { IEnemy, IGame, IItem } from "./types";
import { fight } from "./rules";

export function castCombatSpell(game: IGame, spell: IItem, target?: IEnemy): Promise<void> | void
{
    game.combatLog.length = 0;

    if (spell.attackText) {
        game.logToCombatLog(spell.attackText);
    }

    var damage = game.helpers.rollDice(spell.damage);
    return fight(game, target, spell.attackSound, damage)
}