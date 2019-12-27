import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Frostbite() {
    return Item({
        name: 'Frostbite Spell',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You cast your frostbite',
        itemClass: Class.Wizard 
    });
}