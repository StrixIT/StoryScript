import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Chainmail.html';

export function Chainmail() {
    return Item({
        name: 'Chain Mail',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Body,
        dayAvailable: 2,
        arcane: false,
        value: 20,
        itemClass: Class.Warrior
    });
}