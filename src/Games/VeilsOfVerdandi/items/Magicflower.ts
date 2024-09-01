import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './Magicflower.html?raw';
import { Item } from '../types';

export function Magicflower() {
    return Item({
        name: 'Magic Flower',
        description: description,
        equipmentType: EquipmentType.Miscellaneous
    });
}