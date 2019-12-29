import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Bow.html';

export function Bow() {
    return Item({
        name: 'Bow',
        description: description,
        damage: '1',
        equipmentType: EquipmentType.LeftHand,
        arcane: false,
        value: 3,
        attackText: 'You fire your bow',
        itemClass: [Class.Rogue, Class.Warrior]
    });
}