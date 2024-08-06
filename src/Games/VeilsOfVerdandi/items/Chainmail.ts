import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Chainmail.html';

export function Chainmail() {
    return Item({
        name: 'Chain Mail',
        description: description,
        defence: 2,
        equipmentType: EquipmentType.Body,
        value: 20,
        itemClass: [ClassType.Warrior, ClassType.Rogue]
    });
}