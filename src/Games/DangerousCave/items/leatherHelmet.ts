import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function LeatherHelmet() {
    return Item({
        name: 'Helm van leer',
        verdediging: 1,
        equipmentType: EquipmentType.Head
    });
}