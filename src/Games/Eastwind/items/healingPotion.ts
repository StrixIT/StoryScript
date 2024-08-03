import {IGame, IItem, Item} from '../types';
import {EquipmentType} from 'storyScript/Interfaces/storyScript';
import description from './healingPotion.html';

export function Healingpotion() {
    return Item({
        name: 'Healingpotion',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        useInCombat: true,
        use: (game: IGame, character, item: IItem) => {

        }
    });
}