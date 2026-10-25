import { Item } from '../types';
import { EquipmentType } from 'storyScript'

export function Journal() {
    return Item({
        name: 'Joe\'s journal',
        equipmentType: EquipmentType.Miscellaneous,
    });
}