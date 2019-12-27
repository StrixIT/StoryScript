import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { Class } from '../classes';

export function Goldnecklace() {
    return Item({
        name: 'Necklace',
        damage: '1',
        equipmentType: EquipmentType.Amulet,
        arcane: true,
        value: 5,
        activeNight: true           
    });
}