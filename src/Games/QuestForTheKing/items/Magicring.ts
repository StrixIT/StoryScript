import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Magicring() {
    return Item({
        name: 'Magic Ring',
        damage: '0',
        equipmentType: EquipmentType.LeftRing,
        value: 5,            
        itemClass: Class.Wizard
    });
}