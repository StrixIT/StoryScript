import { Item } from '../types';
import { EquipmentType } from '../../../Engine/Interfaces/storyScript'
import description from './sword.html';

export function Sword() {
    return Item({
        name: 'Sword',
        description: description,
        damage: '3',
        equipmentType: EquipmentType.RightHand,
        value: 5
    });
}