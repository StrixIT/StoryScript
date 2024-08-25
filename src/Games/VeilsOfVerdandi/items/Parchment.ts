import { Key, EquipmentType, OpenWithKey, IBarrier } from 'storyScript/Interfaces/storyScript';
import { IGame, IDestination } from '../types';
import description from './Parchment.html?raw';

export function Parchment() {
    return Key( {
        name: 'Old Parchment',
        description: description,
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        open: {
            text: 'Read the magic word',
            execute: OpenWithKey((game: IGame, barrier: [string, IBarrier], destination: IDestination) => {
                // Add the read parchment html to the location. This will also trigger playing the audio element.
                game.logToLocationLog(game.currentLocation.descriptions['readparchment']);
            })
        }         
    });
}