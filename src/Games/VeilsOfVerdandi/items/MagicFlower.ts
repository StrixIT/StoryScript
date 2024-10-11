import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import description from './MagicFlower.html?raw';
import {Item} from '../types';

export function MagicFlower() {
    return Item({
        name: 'Magic Flower',
        description: description,
        equipmentType: EquipmentType.Miscellaneous
    });
}