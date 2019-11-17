import { Item } from '../interfaces/types';
import { Enumerations, RegisterItem } from '../../../Engine/Interfaces/storyScript'
import description from './sword.html';

export function Sword() {
    return Item({
        name: 'Sword',
        description: description,
        damage: '3',
        equipmentType: Enumerations.EquipmentType.RightHand,
        value: 5
    });
}

RegisterItem(Sword);