﻿import { EquipmentType, OpenWithKey, IBarrier } from 'storyScript/Interfaces/storyScript';
import { IGame, IDestination, Key } from '../types';
import description from './Parchment.html?raw';

export function Parchment() {
    return Key( {
        name: 'Old Parchment',
        description: description,
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