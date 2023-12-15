import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Frostbite.html';

export function Frostbite() {
    return Item({
        name: 'Frostbite Spell',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You cast your frostbite',
        itemClass: ClassType.Wizard 
    });
}