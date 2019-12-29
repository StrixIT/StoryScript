import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Warhammer.html';

export function Warhammer() {
    return Item({
        name: 'Warhammer',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You swing your warhammer',
        itemClass: Class.Warrior
    });
}