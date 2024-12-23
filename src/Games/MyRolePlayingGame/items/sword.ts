import {Item} from '../types';
import {EquipmentType, TargetType} from 'storyScript/Interfaces/storyScript'
import description from './sword.html?raw';

export function Sword() {
    return Item({
        name: 'Sword',
        description: description,
        attack: '1d6',
        equipmentType: EquipmentType.RightHand,
        value: 5,
        targetType: TargetType.Enemy
    });
}