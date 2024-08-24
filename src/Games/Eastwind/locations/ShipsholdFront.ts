import {Elsa} from '../persons/Elsa';
import {IGame, Location} from '../types';
import description from './ShipsholdFront.html?raw';

export function ShipsholdFront() {
    return Location({
        name: 'ShipsholdFront',
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
            ['Investigate the shadow', {
                text: 'Investigate the shadow',
                execute: (game: IGame) => {
                    game.currentLocation.description = game.currentLocation.descriptions['investigate-shadow'];
                    game.currentLocation.persons.add(Elsa);
                }
			}]
        ],
        combatActions: [],
    });
}