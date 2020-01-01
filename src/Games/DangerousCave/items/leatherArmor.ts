import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function LeatherArmor() {
    return Item({
        name: 'Harnas van leer',
        verdediging: 2,
        equipmentType: EquipmentType.Body
    });
}