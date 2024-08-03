import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Boat.html';

export function Boat() {
    return Item({
        name: 'Small Boat',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 10,            
    });
}