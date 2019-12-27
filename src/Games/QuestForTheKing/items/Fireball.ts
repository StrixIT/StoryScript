import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Fireball() {
    return Item({
        name: 'Fireball Spell',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You cast your fireball',
        itemClass: Class.Wizard,
        arcane: true
    });
}