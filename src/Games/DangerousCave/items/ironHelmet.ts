import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function IronHelmet() {
    return Item({
        name: 'Helm van ijzer',
        verdediging: 2,
        equipmentType: EquipmentType.Head
    });
}