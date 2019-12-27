import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Shortsword() {
    return Item({
        name: 'Shortsword',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        arcane: false,
        value: 15,
        attackText: 'You swing your shortsword',
        itemClass: [ Class.Rogue, Class.Warrior ]
    });
}