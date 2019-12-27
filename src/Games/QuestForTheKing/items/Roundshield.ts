import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Roundshield() {
    return Item({
        name: 'Round Shield',
        damage: '2',
        equipmentType: EquipmentType.RightHand,
        dayAvailable: 2,
        arcane: false,
        value: 10,
        itemClass: Class.Warrior
    });
}