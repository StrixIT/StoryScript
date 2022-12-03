import { fight } from "../rules";
import { IEnemy, IGame } from "../types";
import { IEquipment } from "./equipment";
import { IItem, Item } from "./item";

export function Spell(entity: IItem, damage: string): ISpell {
    var spell = Item({ 
        ... entity,
        equipmentType: 'Spell',
        useInCombat: (item: IItem, equipment: IEquipment) => {
            return equipment.spell === item;
        },
        use: use

    }) as ISpell;

    spell.isSpell = true;
    spell.damage = damage;
    return spell;
}

export interface ISpell extends IItem {
    damage: string;
    isSpell: boolean;
}

const use = (game: IGame, spell: ISpell, target?: IEnemy): Promise<void> | void =>
{
    game.combatLog.length = 0;

    if (spell.attackText) {
        game.logToCombatLog(spell.attackText);
    }

    var damage = game.helpers.rollDice(spell.damage);
    return fight(game, target, spell.attackSound, damage)
}