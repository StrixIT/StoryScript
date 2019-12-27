import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Boat() {
    return Item({
        name: 'Small Boat',
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 10,            
    });
}