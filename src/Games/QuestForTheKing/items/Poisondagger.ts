import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Poisondagger() {
    return Item({
        name: 'Poison Dagger',
        damage: '3',
        equipmentType: EquipmentType.LeftHand,           
        value: 5,
        attackText: 'You thrust your dagger',
        itemClass: Class.Rogue           
    });
}