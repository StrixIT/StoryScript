import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Bow.html?raw';
import { Constants } from '../constants';

export function Bow() {
    return Item({
        name: 'Bow',
        description: description,
        damage: '1',
        equipmentType: Constants.Bow,
        arcane: false,
        value: 3,
        attackText: '{0}} shoots the bow',
        itemClass: [ClassType.Rogue, ClassType.Warrior]
    });
}