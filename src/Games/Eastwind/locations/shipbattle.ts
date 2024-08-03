import {Location} from '../types';
import description from './shipbattle.html';
import {Shipbattle2} from './shipbattle2';

export function Shipbattle() {
    return Location({
        name: 'Shipbattle',
        description: description,
        destinations: [
            {
                name: 'Continue...',
                target: Shipbattle2,
            },

        ],
        features: [],
        items: [],
        enemies: [],
        persons: [],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [],
        combatActions: [],
    });
}