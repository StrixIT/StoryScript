import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './healingPotion.html';

export function HealingPotion() {
    return Item({
        name: 'Healing potion',
        description: description,
        equipmentType: EquipmentType.Miscellaneous
    });
}