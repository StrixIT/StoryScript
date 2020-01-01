import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function Lantern() {
    return Item({
        name: 'Lantaren',
        oplettendheid: 1,
        equipmentType: EquipmentType.LeftHand
    });
}