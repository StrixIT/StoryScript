import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Wizardcloak.html?raw';

export function WizardCloak() {
    return Item({
        name: 'Wizard Cloak',
        description: description,
        defence: 1,
        equipmentType: EquipmentType.Body,
        value: 15,
        itemClass: ClassType.Wizard
    });
}