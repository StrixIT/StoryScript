import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Paralysis() {
    return Item({
        name: 'Paralysis',
        damage: '2',
        equipmentType: EquipmentType.Hands,
        dayAvailable: 3,
        arcane: true,
        value: 30,
        attackText: 'You cast your Paralysis spell',
        itemClass: Class.Wizard
    });
}