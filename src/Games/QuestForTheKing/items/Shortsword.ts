import { Item, EquipmentType } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';
import description from './Shortsword.html';
import { Constants } from '../constants';

export function Shortsword() {
    return Item({
        name: 'Shortsword',
        description: description,
        damage: '2',
        equipmentType: Constants.PrimaryWeapon,
        arcane: false,
        value: 15,
        attackText: '{0}} swings the shortsword',
        itemClass: [ ClassType.Rogue, ClassType.Warrior ]
    });
}