﻿import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './LeatherArmor.html?raw';
import {Item} from '../types';

export function LeatherArmor() {
    return Item({
        name: 'Leather Armor',
        description: description,
        defense: 1,
        equipmentType: EquipmentType.Body,
        itemClass: [ClassType.Rogue, ClassType.Warrior]
    });
}