import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Magicshield() {
    return Item({
        name: 'Magic Shield Spell',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        dayAvailable: 2,
        arcane: true,
        value: 15,
        itemClass: Class.Wizard
    });
}