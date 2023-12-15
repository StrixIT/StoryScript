import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Wizardcloak.html';

export function Wizardcloak() {
    return Item({
        name: 'Wizard Cloak',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.Body,
        dayAvailable: 2,
        arcane: true,
        value: 15,
        itemClass: ClassType.Wizard
    });
}