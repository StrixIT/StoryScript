import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Beesting() {
    return Item({
        name: 'Beesting',
        damage: '1D10',
        equipmentType: EquipmentType.LeftHand,
        value: 20,       
        itemClass: Class.Warrior     
    });
}