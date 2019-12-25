import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function SmallShield() {
    return Item({
        name: 'Klein schild',
        defense: 2,
        equipmentType: EquipmentType.LeftHand
    });
}