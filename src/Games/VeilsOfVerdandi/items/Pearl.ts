import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Pearl.html?raw';
import { Item } from '../types';

export function Pearl() {
    return Item({
        name: 'Pearl',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        value: 20,            
    });
}