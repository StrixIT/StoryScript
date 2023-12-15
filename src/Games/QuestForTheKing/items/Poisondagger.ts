import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Poisondagger.html';

export function Poisondagger() {
    return Item({
        name: 'Poison Dagger',
        description: description,
        damage: '3',
        equipmentType: EquipmentType.LeftHand,           
        value: 5,
        attackText: 'You thrust your dagger',
        itemClass: ClassType.Rogue           
    });
}