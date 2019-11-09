import { Item } from '../interfaces/types';
import { Enumerations, RegisterItem } from '../../../Engine/Interfaces/storyScript'

export function LeatherBoots() {
    return Item({
        name: 'Leather boots',
        defense: 1,
        equipmentType: Enumerations.EquipmentType.Feet,
        value: 2
    });
}

RegisterItem(LeatherBoots);