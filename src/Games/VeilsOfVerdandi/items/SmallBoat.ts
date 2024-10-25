import {Key} from '../types';
import {EquipmentType, IBarrier, IDestination, OpenWithKey} from 'storyScript/Interfaces/storyScript';
import description from './SmallBoat.html?raw';
import {IGame} from "../../MyRolePlayingGame/interfaces/game.ts";

export function SmallBoat() {
    return Key({
        name: 'Small boat',
        description: description,
        equipmentType: EquipmentType.Miscellaneous,
        open: {
            text: 'Sail the ocean',
            execute: OpenWithKey((game: IGame, barrier: [string, IBarrier], destination: IDestination) => {
                game.logToLocationLog('You slide the small boat into the surf and set out for sea!');
                game.changeLocation(destination.target);
            })
        },
        keepAfterUse: true
    });
}