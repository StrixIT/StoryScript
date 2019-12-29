import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Magicring.html';

export function Magicring() {
    return Item({
        name: 'Magic Ring',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.LeftRing,
        value: 5,            
        itemClass: Class.Wizard
    });
}