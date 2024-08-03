import {IEnemy, IGame, IItem} from "./types";
import {fight} from "./rules";
import {ICharacter} from "storyScript/Interfaces/character.ts";

export function castCombatSpell(game: IGame, character: ICharacter, spell: IItem, target?: IEnemy): Promise<void> | void {
    game.combatLog.length = 0;

    if (spell.attackText) {
        game.logToCombatLog(spell.attackText);
    }

    var damage = game.helpers.rollDice(spell.damage);
    return fight(game, target, spell.attackSound, damage)
}