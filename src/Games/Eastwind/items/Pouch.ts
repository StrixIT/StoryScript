import {Item} from '../types';
import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import description from './Pouch.html';

export function Pouch() {
    return Item({
        name: 'Pouch',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
    });
}