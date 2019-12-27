import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Warhammer() {
    return Item({
        name: 'Warhammer',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You swing your warhammer',
        itemClass: Class.Warrior
    });
}