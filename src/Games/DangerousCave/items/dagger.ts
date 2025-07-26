import {EquipmentType, TargetType} from 'storyScript/Interfaces/storyScript';
import { Item } from '../types';

export function Dagger() {
    return Item({
        name: 'Dolk',
        schade: 1,
        equipmentType: EquipmentType.RightHand,
        targetType: TargetType.Enemy
    });
}