import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Pearl.html';

export function Pearl() {
    return Item({
        name: 'Pearl',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 20,            
    });
}