import { Key } from '../interfaces/types';
import { Enumerations, IDestination, Actions, RegisterItem, IGame, IBarrier } from '../../../Engine/Interfaces/storyScript'

export function BasementKey() {
    return Key({
        name: 'Basement key',
        keepAfterUse: false,
        open: {
            text: 'Open',
            execute: Actions.OpenWithKey((game: IGame, barrier: IBarrier, destination: IDestination) => {
                game.logToLocationLog('You open the trap door. A wooden staircase leads down into the darkness.');
            })
        },
        equipmentType: Enumerations.EquipmentType.Miscellaneous
    });
}

RegisterItem(BasementKey);