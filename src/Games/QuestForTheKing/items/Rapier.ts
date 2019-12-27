import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Rapier() {
    return Item({
        name: 'Rapier',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,
        value: 5,
        attackText: 'You thrust your rapier',
        itemClass: Class.Rogue
    });
}