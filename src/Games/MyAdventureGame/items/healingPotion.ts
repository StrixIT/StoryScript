import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './healingPotion.html?raw';

export function HealingPotion() {
    return Item({
        name: 'Healing potion',
        description: description,
        equipmentType: EquipmentType.Miscellaneous
    });
}