import { Item } from '../types';
import { Enumerations } from '../../../Engine/Interfaces/storyScript';

export function Flask() {
    return Item({
        name: 'Flask',
        equipmentType: Enumerations.EquipmentType.Miscellaneous
    });
}