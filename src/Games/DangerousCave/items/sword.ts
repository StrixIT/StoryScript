import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function Sword() {
    return Item({
        name: 'Zwaard',
        schade: 3,
        equipmentType: EquipmentType.RightHand
    });
}