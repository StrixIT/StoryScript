import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Dagger.html';

export function Dagger() {
    return Item({
        name: 'Dagger',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,           
        value: 5,
        attackText: 'You thrust your dagger',
        itemClass: [Class.Rogue, Class.Warrior]       
    });
}