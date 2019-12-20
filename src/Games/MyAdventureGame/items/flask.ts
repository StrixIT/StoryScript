import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';

export function Flask() {
    return Item({
        name: 'Flask',
        equipmentType: EquipmentType.Miscellaneous
    });
}