﻿import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Fireball.html';

export function Fireball() {
    return Item({
        name: 'Fireball Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You cast your fireball',
        itemClass: ClassType.Wizard,
        arcane: true
    });
}