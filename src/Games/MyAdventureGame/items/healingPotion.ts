import { Item } from '../types';
import { Enumerations } from '../../../Engine/Interfaces/storyScript';

export function HealingPotion() {
    return Item({
        name: 'Healing potion',
        equipmentType: Enumerations.EquipmentType.Miscellaneous
    });
}