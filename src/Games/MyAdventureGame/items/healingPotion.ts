import { Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript';

export function HealingPotion() {
    return Item({
        name: 'Healing potion',
        equipmentType: EquipmentType.Miscellaneous
    });
}