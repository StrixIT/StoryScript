import { Item } from '../interfaces/types';
import { Enumerations, RegisterItem } from '../../../Engine/Interfaces/storyScript'

export function Sword() {
    return Item({
        name: 'Sword',
        damage: '3',
        equipmentType: Enumerations.EquipmentType.RightHand,
        value: 5
    });
}

RegisterItem(Sword);