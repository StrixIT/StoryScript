import { Item } from '../types';
import { EquipmentType } from 'storyScript/Interfaces/storyScript';
import description from './flask.html?raw';

export function Flask() {
    return Item({
        name: 'Flask',
        description: description,
        equipmentType: EquipmentType.Miscellaneous
    });
}