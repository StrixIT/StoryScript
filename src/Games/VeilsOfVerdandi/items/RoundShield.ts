import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './RoundShield.html?raw';
import { Item } from '../types';
import {Constants} from "../constants.ts";

export function RoundShield() {
    return Item({
        name: 'Round Shield',
        description: description,
        defense: 1,
        equipmentType: Constants.SecondaryWeapon,
        value: 15,
        itemClass: ClassType.Warrior
    });
}