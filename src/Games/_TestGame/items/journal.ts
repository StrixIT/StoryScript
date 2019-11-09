import { Item } from '../interfaces/types';
import { Enumerations, RegisterItem } from '../../../Engine/Interfaces/storyScript'

export function Journal() {
    return Item({
        name: 'Joe\'s journal',
        equipmentType: Enumerations.EquipmentType.Miscellaneous,
    });
}

RegisterItem(Journal);