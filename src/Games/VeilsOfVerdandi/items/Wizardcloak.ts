import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './Wizardcloak.html?raw';
import {Item} from '../types';

export function WizardCloak() {
    return Item({
        name: 'Wizard Cloak',
        description: description,
        defense: 1,
        equipmentType: EquipmentType.Body,
        value: 15,
        itemClass: ClassType.Wizard
    });
}