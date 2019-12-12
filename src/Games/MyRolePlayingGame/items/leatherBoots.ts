import { Item } from '../types';
import { Enumerations } from '../../../Engine/Interfaces/storyScript'

export function LeatherBoots() {
    return Item({
        name: 'Leather boots',
        defense: 1,
        equipmentType: Enumerations.EquipmentType.Feet,
        value: 2
    });
}