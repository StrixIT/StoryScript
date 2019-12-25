import { IDestination, EquipmentType, OpenWithKey, IBarrier } from 'storyScript/Interfaces/storyScript';
import { IGame, Key } from '../types';

export function BlackKey() {
    return Key({
        name: 'Zwarte sleutel',
        description: 'Op deze zwarte sleutel staat de afbeelding van een waterspuwer.',
        equipmentType: EquipmentType.Miscellaneous,
        open: {
            text: 'Open de deur met de zwarte sleutel',
            execute: OpenWithKey((game: IGame, barrier: IBarrier, destination: IDestination) => {
                game.logToLocationLog('Je opent de deur.');
                destination.name = 'Donkere kamer';
            })
        }
    });
}