import {Item} from '../types';
import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import description from './map.html?raw';

export function Map() {
    return Item({
        name: 'Map',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
    });
}