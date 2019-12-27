import { Key, EquipmentType, OpenWithKey, IBarrier } from 'storyScript/Interfaces/storyScript';
import { IGame, IDestination } from '../types';

export function Parchment() {
    return Key( {
        name: 'Old Parchment',
        damage: '0',
        equipmentType: EquipmentType.Miscellaneous,
        open: {
            text: 'Read the magic word',
            execute: OpenWithKey((game: IGame, barrier: IBarrier, destination: IDestination) => {
                // Add the read parchment html to the location. This will also trigger playing the audio element.
                game.logToLocationLog(game.currentLocation.descriptions['readparchment']);
            })
        }         
    });
}