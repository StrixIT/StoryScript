import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';
import { Heal } from '../actions/heal';

export function HealingPotion() {
    return Item({
        name: 'Toverdrank',
        equipmentType: EquipmentType.Miscellaneous,
        use: Heal('1d8'),
        useInCombat: true,
        charges: 1
    });
}