import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Strengthpotion() {
    return Item({
        name: 'Strength Potion',
        damage: '2',
        equipmentType: EquipmentType.Miscellaneous,
        dayAvailable: 2,
        arcane: true,
        value: 5
    });
}