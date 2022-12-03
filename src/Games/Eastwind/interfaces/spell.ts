import { IEquipment } from "./equipment";
import { IItem, Item } from "./item";

export function Spell(entity: { name: string, description: string }): ISpell {
    var spell = Item({ ... entity, equipmentType: 'Spell' }) as ISpell;
    spell.useInCombat = (item: IItem, equipment: IEquipment) => {
        return equipment.spell === item;
    };
    spell.isSpell = true;
    return spell;
}

export interface ISpell extends IItem {
    isSpell: boolean;
}