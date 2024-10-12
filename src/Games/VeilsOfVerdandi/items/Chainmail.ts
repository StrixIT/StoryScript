import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './Chainmail.html?raw';
import {Item} from '../types';

export function Chainmail() {
    return Item({
        name: 'Chain Mail',
        description: description,
        defense: 2,
        equipmentType: EquipmentType.Body,
        itemClass: [ClassType.Warrior, ClassType.Rogue]
    });
}