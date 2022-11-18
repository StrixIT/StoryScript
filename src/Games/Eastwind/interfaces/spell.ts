import { EquipmentType } from "storyScript/Interfaces/storyScript";
import { IItem, Item } from "./item";

export function Spell(entity: { name: string, description: string }): ISpell {
    var spell = Item({ ... entity, equipmentType: EquipmentType.Miscellaneous }) as ISpell;
    spell.useInCombat = true;
    spell.isSpell = true;
    return spell;
}

export interface ISpell extends IItem {
    isSpell: boolean;
}