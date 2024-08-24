import {IGame, Location} from '../types';
import description from './Junglepond.html?raw';

export function Junglepond() {
    return Location({
        name: 'Junglepond',
        description: description,
        destinations: [],
        features: [],
        items: [],
        enemies: [],
        persons: [],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [
            ['ApproachThePond', {
                text: 'Approach the Pond',
                execute: (game: IGame) => {
                    game.currentLocation.description = game.currentLocation.descriptions['Approach the Pond'];

                },
            }]
        ],
        combatActions: [],
    });
}