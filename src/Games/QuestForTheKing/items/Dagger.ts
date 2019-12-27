import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Dagger() {
    return Item({
        name: 'Dagger',
        damage: '2',
        equipmentType: EquipmentType.LeftHand,           
        value: 5,
        attackText: 'You thrust your dagger',
        itemClass: [Class.Rogue, Class.Warrior]       
    });
}