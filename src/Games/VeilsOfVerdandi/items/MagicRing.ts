import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import {ClassType} from '../classType';
import description from './MagicRing.html?raw';
import {Item} from '../types';

export function MagicRing() {
    return Item({
        name: 'Magic Ring',
        description: description,
        equipmentType: EquipmentType.LeftRing,
        value: 40,
        itemClass: ClassType.Wizard
    });
}