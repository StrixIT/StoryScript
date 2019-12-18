import { Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript'

export function Journal() {
    return Item({
        name: 'Joe\'s journal',
        equipmentType: EquipmentType.Miscellaneous,
    });
}