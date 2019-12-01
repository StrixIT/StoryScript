import { Item } from '../types';
import { Enumerations } from '../../../Engine/Interfaces/storyScript'

export function Journal() {
    return Item({
        name: 'Joe\'s journal',
        equipmentType: Enumerations.EquipmentType.Miscellaneous,
    });
}