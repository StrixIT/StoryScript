﻿import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Roundshield.html?raw';
import { Item } from '../types';

export function Roundshield() {
    return Item({
        name: 'Round Shield',
        description: description,
        defense: 1,
        equipmentType: EquipmentType.RightHand,
        value: 15,
        itemClass: ClassType.Warrior
    });
}