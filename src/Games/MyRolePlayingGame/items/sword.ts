import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript'
import description from './sword.html';

export function Sword() {
    return Item({
        name: 'Sword',
        description: description,
        damage: 3,
        equipmentType: EquipmentType.RightHand,
        value: 5
    });
}