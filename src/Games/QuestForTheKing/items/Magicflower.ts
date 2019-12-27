import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Magicflower() {
    return Item({
        name: 'Magic Flower',
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        value: 0
    });
}