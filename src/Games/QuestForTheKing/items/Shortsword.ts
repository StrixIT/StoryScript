import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Shortsword.html';

export function Shortsword() {
    return Item({
        name: 'Shortsword',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        arcane: false,
        value: 15,
        attackText: 'You swing your shortsword',
        itemClass: [ Class.Rogue, Class.Warrior ]
    });
}