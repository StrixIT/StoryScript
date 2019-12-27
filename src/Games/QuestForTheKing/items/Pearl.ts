import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Pearl() {
    return Item({
        name: 'Pearl',
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 20,            
    });
}