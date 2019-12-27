import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';

export function LeatherBoots() {
    return Item({
        name: 'Leather boots',
        defense: 1,
        equipmentType: EquipmentType.Feet,
        value: 2
    });
}