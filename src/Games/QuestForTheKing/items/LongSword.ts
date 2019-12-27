import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function LongSword() {
    return Item({
        name: 'Long Sword',
        damage: '1D6',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You swing your longsword',
        itemClass: Class.Warrior
    });
}