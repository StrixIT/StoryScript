import {IGame, Key} from '../types';
import {EquipmentType, IBarrier, IDestination, OpenWithKey} from 'storyScript/Interfaces/storyScript'

export function BasementKey() {
    return Key({
        name: 'Basement key',
        keepAfterUse: false,
        open: {
            text: 'Open',
            execute: OpenWithKey((game: IGame, barrier: [string, IBarrier], destination: IDestination) => {
                game.logToLocationLog('You open the trap door. A wooden staircase leads down into the darkness.');
            })
        },
        equipmentType: EquipmentType.Miscellaneous
    });
}