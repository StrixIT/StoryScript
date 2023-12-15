import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Beesting.html';

export function Beesting() {
    return Item({
        name: 'Beesting',
        description: description,
        damage: '1D10',
        equipmentType: EquipmentType.LeftHand,
        value: 20,       
        itemClass: ClassType.Warrior     
    });
}