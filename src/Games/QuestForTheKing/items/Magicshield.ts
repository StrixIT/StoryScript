import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Magicshield.html';

export function Magicshield() {
    return Item({
        name: 'Magic Shield Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        dayAvailable: 2,
        arcane: true,
        value: 15,
        itemClass: ClassType.Wizard
    });
}