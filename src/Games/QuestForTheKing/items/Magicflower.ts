import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';
import description from './Magicflower.html';

export function Magicflower() {
    return Item({
        name: 'Magic Flower',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 0
    });
}