import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Goldnecklace.html';

export function Goldnecklace() {
    return Item({
        name: 'Necklace',
        description: description,
        damage: '1',
        equipmentType: EquipmentType.Amulet,
        arcane: true,
        value: 5,
        activeNight: true           
    });
}