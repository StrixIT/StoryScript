import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Platemail.html';

export function Platemail() {
    return Item({
        name: 'Platemail',
        description: description,
        equipmentType: EquipmentType.Body,
        dayAvailable: 1,
        arcane: false,
        value: 45,
        itemClass: [ClassType.Warrior]
    });
}