import {EquipmentType, IBarrier, OpenWithKey} from 'storyScript/Interfaces/storyScript';
import {IDestination, IGame, Key} from '../types';
import description from './Parchment.html?raw';

export function Parchment() {
    return Key({
        name: 'Old Parchment',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        open: {
            text: 'Read the magic word',
            execute: OpenWithKey((game: IGame, barrier: [string, IBarrier], destination: IDestination) => {
                game.currentLocation.descriptionSelector = 'readparchment';
            })
        }
    });
}