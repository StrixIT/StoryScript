import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Beesting.html';

export function Beesting() {
    return Item({
        name: 'Beesting',
        description: description,
        damage: '1D10',
        equipmentType: EquipmentType.LeftHand,
        value: 20,       
        itemClass: Class.Warrior     
    });
}