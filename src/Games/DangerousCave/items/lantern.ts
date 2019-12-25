import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function Lantern() {
    return Item({
        name: 'Lantaren',
        bonuses: {
            perception: 1
        },
        equipmentType: EquipmentType.LeftHand
    });
}