import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Magicflower.html?raw';

export function Magicflower() {
    return Item({
        name: 'Magic Flower',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 0
    });
}