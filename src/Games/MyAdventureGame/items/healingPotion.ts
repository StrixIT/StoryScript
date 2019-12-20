import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';

export function HealingPotion() {
    return Item({
        name: 'Healing potion',
        equipmentType: EquipmentType.Miscellaneous
    });
}