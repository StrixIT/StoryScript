﻿import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Goldnecklace.html?raw';
import { heal } from '../gameFunctions';

export function Goldnecklace() {
    return Item({
        name: 'Necklace',
        description: description,
        equipmentType: EquipmentType.Amulet,
        speed: 7,
        arcane: true,
        value: 5,
        activeNight: true,
        useInCombat: true,
        use(game, character, item, target) {
            heal(character, 3);
        },   
    });
}