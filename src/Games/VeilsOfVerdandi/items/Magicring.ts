import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Magicring.html?raw';

export function Magicring() {
    return Item({
        name: 'Magic Ring',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.LeftRing,
        value: 5,            
        itemClass: ClassType.Wizard
    });
}