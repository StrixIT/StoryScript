import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Platemail() {
    return Item({
        name: 'Platemail',
        equipmentType: EquipmentType.Body,
        dayAvailable: 1,
        arcane: false,
        value: 45,
        itemClass: [Class.Warrior]
    });
}