import {Pirate} from '../enemies/Pirate';
import {Location} from '../types';
import description from './shipbattle2.html';
import {Waterworld} from './Waterworld';

export function Shipbattle2() {
    return Location({
        name: 'Shipbattle2',
        description: description,
        destinations: [
            {
                name: 'Continue...',
                target: Waterworld,
            },
        ],
        features: [],
        items: [],
        enemies: [
            Pirate()
        ],
        persons: [],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [],
        combatActions: [],
    });
}