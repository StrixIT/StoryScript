import { Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript';

export function Flask() {
    return Item({
        name: 'Flask',
        equipmentType: EquipmentType.Miscellaneous
    });
}