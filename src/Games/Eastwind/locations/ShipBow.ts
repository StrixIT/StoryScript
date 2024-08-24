import {Adventurers} from '../persons/Adventurers';
import {Location} from '../types';
import description from './ShipBow.html?raw';
import {Shipsdeck} from './shipsdeck';

export function ShipBow() {
    return Location({
        name: 'ShipBow',
        description: description,
        destinations: [
            {
                name: 'Go to the center of the ship',
                target: Shipsdeck,
            },
        ],
        features: [],
        items: [],
        enemies: [],
        persons: [
            Adventurers()
        ],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [],
        combatActions: [],
    });
}