import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
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
        itemClass: ClassType.Warrior
    });
}