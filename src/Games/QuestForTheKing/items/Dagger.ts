import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Dagger.html';

export function Dagger() {
    return Item({
        name: 'Dagger',
        description: description,
        damage: '2',
        equipmentType: EquipmentType.LeftHand,           
        value: 5,
        attackText: 'You thrust your dagger',
        itemClass: [ClassType.Rogue, ClassType.Warrior]       
    });
}